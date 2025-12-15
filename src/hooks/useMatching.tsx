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

export interface SwipeHistoryItem {
  id: string;
  profile: ProfileWithDetails;
  action: 'like' | 'dislike' | 'superlike';
  timestamp: Date;
}

export interface Filters {
  minAge: number;
  maxAge: number;
  maxDistance: number;
  verifiedOnly: boolean;
  preferredGender: string[];
}

const defaultFilters: Filters = {
  minAge: 18,
  maxAge: 50,
  maxDistance: 50,
  verifiedOnly: false,
  preferredGender: ['male', 'female', 'other']
};

export function useMatching() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<ProfileWithDetails[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMatch, setNewMatch] = useState<Match | null>(null);
  const [swipeHistory, setSwipeHistory] = useState<SwipeHistoryItem[]>([]);
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  // Load user preferences/filters
  const loadFilters = useCallback(async () => {
    if (!user) return;

    const { data } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setFilters({
        minAge: data.min_age ?? 18,
        maxAge: data.max_age ?? 50,
        maxDistance: data.max_distance_km ?? 50,
        verifiedOnly: data.show_verified_only ?? false,
        preferredGender: (data.preferred_gender as string[]) ?? ['male', 'female', 'other']
      });
    }
  }, [user]);

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
    
    let query = supabase
      .from('profiles')
      .select('*')
      .not('id', 'in', `(${excludeIds.join(',')})`)
      .eq('onboarding_completed', true);

    // Apply gender filter
    if (filters.preferredGender.length > 0) {
      query = query.in('gender', filters.preferredGender as ('male' | 'female' | 'other' | 'prefer_not_to_say')[]);
    }

    // Apply verified filter
    if (filters.verifiedOnly) {
      query = query.eq('verification_status', 'verified');
    }

    const { data: profilesData } = await query.limit(20);

    if (profilesData) {
      // Fetch photos and interests for each profile
      const profilesWithDetails = await Promise.all(
        profilesData.map(async (profile) => {
          // Calculate age and filter
          const birthDate = new Date(profile.date_of_birth);
          const age = new Date().getFullYear() - birthDate.getFullYear();
          
          if (age < filters.minAge || age > filters.maxAge) {
            return null;
          }

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

      setProfiles(profilesWithDetails.filter(Boolean) as ProfileWithDetails[]);
    }
    setLoading(false);
  }, [user, filters]);

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
      loadFilters();
    }
  }, [user, loadFilters]);

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

    // Find the profile before removing it
    const swipedProfile = profiles.find(p => p.id === profileId);

    const { error } = await supabase
      .from('swipes')
      .insert({
        swiper_id: user.id,
        swiped_id: profileId,
        action
      });

    if (!error) {
      // Remove from profiles list
      setProfiles(prev => prev.filter(p => p.id !== profileId));
      
      // Add to swipe history for undo
      if (swipedProfile) {
        setSwipeHistory(prev => [{
          id: profileId,
          profile: swipedProfile,
          action,
          timestamp: new Date()
        }, ...prev.slice(0, 9)]); // Keep last 10 swipes
      }
    }

    return { error };
  };

  const undoLastSwipe = async () => {
    if (!user || swipeHistory.length === 0) return { error: new Error('Nothing to undo') };

    const lastSwipe = swipeHistory[0];

    // Delete the swipe from database
    const { error } = await supabase
      .from('swipes')
      .delete()
      .eq('swiper_id', user.id)
      .eq('swiped_id', lastSwipe.id);

    if (!error) {
      // Add profile back to the front
      setProfiles(prev => [lastSwipe.profile, ...prev]);
      
      // Remove from history
      setSwipeHistory(prev => prev.slice(1));
    }

    return { error };
  };

  const updateFilters = (newFilters: Filters) => {
    setFilters(newFilters);
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
    refetchMatches: fetchMatches,
    swipeHistory,
    undoLastSwipe,
    canUndo: swipeHistory.length > 0,
    filters,
    updateFilters
  };
}
