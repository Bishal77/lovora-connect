import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { Profile, UserPhoto, Interest } from './useProfile';

export interface ProfileWithDetails extends Profile {
  photos: UserPhoto[];
  interests: Interest[];
  distance_km?: number;
}

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  matched_at: string;
  is_active: boolean;
  last_message_at: string | null;
  other_user?: ProfileWithDetails;
}

export function useMatching() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<ProfileWithDetails[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMatch, setNewMatch] = useState<Match | null>(null);

  const fetchProfilesToSwipe = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    // Get already swiped profiles
    const { data: swipedData } = await supabase
      .from('swipes')
      .select('swiped_id')
      .eq('swiper_id', user.id);

    const swipedIds = swipedData?.map(s => s.swiped_id) || [];

    // Get blocked users
    const { data: blockedData } = await supabase
      .from('blocks')
      .select('blocked_id')
      .eq('blocker_id', user.id);

    const blockedIds = blockedData?.map(b => b.blocked_id) || [];

    // Fetch profiles excluding swiped and blocked
    const excludeIds = [...swipedIds, ...blockedIds, user.id];
    
    const { data: profilesData } = await supabase
      .from('profiles')
      .select('*')
      .not('id', 'in', `(${excludeIds.join(',')})`)
      .eq('onboarding_completed', true)
      .limit(20);

    if (profilesData) {
      // Fetch photos and interests for each profile
      const profilesWithDetails = await Promise.all(
        profilesData.map(async (profile) => {
          const { data: photos } = await supabase
            .from('user_photos')
            .select('*')
            .eq('user_id', profile.id)
            .order('order_index');

          const { data: interestsData } = await supabase
            .from('user_interests')
            .select('interests(*)')
            .eq('user_id', profile.id);

          const interests = interestsData?.map((i: any) => i.interests) || [];

          return {
            ...profile,
            photos: photos || [],
            interests
          } as ProfileWithDetails;
        })
      );

      setProfiles(profilesWithDetails);
    }
    setLoading(false);
  }, [user]);

  const fetchMatches = useCallback(async () => {
    if (!user) return;

    const { data } = await supabase
      .from('matches')
      .select('*')
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .eq('is_active', true)
      .order('matched_at', { ascending: false });

    if (data) {
      // Fetch other user details for each match
      const matchesWithUsers = await Promise.all(
        data.map(async (match) => {
          const otherUserId = match.user1_id === user.id ? match.user2_id : match.user1_id;
          
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', otherUserId)
            .single();

          const { data: photos } = await supabase
            .from('user_photos')
            .select('*')
            .eq('user_id', otherUserId)
            .order('order_index');

          return {
            ...match,
            other_user: profile ? { ...profile, photos: photos || [], interests: [] } : undefined
          } as Match;
        })
      );

      setMatches(matchesWithUsers);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchProfilesToSwipe();
      fetchMatches();

      // Subscribe to new matches
      const channel = supabase
        .channel('matches-channel')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'matches',
            filter: `user1_id=eq.${user.id}`
          },
          async (payload) => {
            const match = payload.new as Match;
            const otherUserId = match.user1_id === user.id ? match.user2_id : match.user1_id;
            
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', otherUserId)
              .single();

            const { data: photos } = await supabase
              .from('user_photos')
              .select('*')
              .eq('user_id', otherUserId);

            const matchWithUser = {
              ...match,
              other_user: profile ? { ...profile, photos: photos || [], interests: [] } : undefined
            } as Match;

            setNewMatch(matchWithUser);
            setMatches(prev => [matchWithUser, ...prev]);
          }
        )
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'matches',
            filter: `user2_id=eq.${user.id}`
          },
          async (payload) => {
            const match = payload.new as Match;
            const otherUserId = match.user1_id === user.id ? match.user2_id : match.user1_id;
            
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', otherUserId)
              .single();

            const { data: photos } = await supabase
              .from('user_photos')
              .select('*')
              .eq('user_id', otherUserId);

            const matchWithUser = {
              ...match,
              other_user: profile ? { ...profile, photos: photos || [], interests: [] } : undefined
            } as Match;

            setNewMatch(matchWithUser);
            setMatches(prev => [matchWithUser, ...prev]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user, fetchProfilesToSwipe, fetchMatches]);

  const swipe = async (profileId: string, action: 'like' | 'dislike' | 'superlike') => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('swipes')
      .insert({
        swiper_id: user.id,
        swiped_id: profileId,
        action
      });

    if (!error) {
      setProfiles(prev => prev.filter(p => p.id !== profileId));
    }

    return { error };
  };

  const clearNewMatch = () => setNewMatch(null);

  return {
    profiles,
    matches,
    loading,
    newMatch,
    swipe,
    clearNewMatch,
    refetchProfiles: fetchProfilesToSwipe,
    refetchMatches: fetchMatches
  };
}
