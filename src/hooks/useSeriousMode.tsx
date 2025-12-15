import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface SeriousProfile {
  id: string;
  user_id: string;
  religion: string | null;
  caste: string | null;
  mother_tongue: string | null;
  family_type: string | null;
  father_occupation: string | null;
  mother_occupation: string | null;
  siblings: number | null;
  family_values: string | null;
  about_family: string | null;
  salary_range: string | null;
  assets: string | null;
  expectations: string | null;
  partner_age_min: number | null;
  partner_age_max: number | null;
  partner_height_min: number | null;
  partner_height_max: number | null;
  partner_education: string[] | null;
  partner_occupation: string[] | null;
  partner_religion: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface SeriousProfileWithDetails extends SeriousProfile {
  profile: {
    id: string;
    full_name: string;
    display_name: string | null;
    date_of_birth: string;
    gender: string;
    city: string | null;
    country: string | null;
    occupation: string | null;
    education: string | null;
    height_cm: number | null;
    verification_status: string;
    bio: string | null;
  };
  photos: Array<{
    id: string;
    photo_url: string;
    is_primary: boolean;
  }>;
}

const defaultSeriousProfile: Partial<SeriousProfile> = {
  religion: null,
  caste: null,
  mother_tongue: null,
  family_type: null,
  father_occupation: null,
  mother_occupation: null,
  siblings: null,
  family_values: null,
  about_family: null,
  salary_range: null,
  assets: null,
  expectations: null,
  partner_age_min: 21,
  partner_age_max: 35,
  partner_height_min: 150,
  partner_height_max: 190,
  partner_education: [],
  partner_occupation: [],
  partner_religion: [],
};

export function useSeriousMode() {
  const { user } = useAuth();
  const [seriousProfile, setSeriousProfile] = useState<SeriousProfile | null>(null);
  const [profiles, setProfiles] = useState<SeriousProfileWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);

  const fetchSeriousProfile = useCallback(async () => {
    if (!user) return;
    setProfileLoading(true);

    const { data, error } = await supabase
      .from('serious_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!error && data) {
      setSeriousProfile(data as SeriousProfile);
    }
    setProfileLoading(false);
  }, [user]);

  const fetchProfiles = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    // Get already expressed interest
    const { data: expressedData } = await supabase
      .from('interest_expressions')
      .select('receiver_id')
      .eq('sender_id', user.id);

    const expressedIds = expressedData?.map(e => e.receiver_id) || [];

    // Get blocked users
    const { data: blockedData } = await supabase
      .from('blocks')
      .select('blocked_id')
      .eq('blocker_id', user.id);

    const blockedIds = blockedData?.map(b => b.blocked_id) || [];

    const excludeIds = [...expressedIds, ...blockedIds, user.id];

    // Fetch serious profiles
    const { data: seriousData } = await supabase
      .from('serious_profiles')
      .select('*')
      .not('user_id', 'in', `(${excludeIds.join(',')})`)
      .limit(20);

    if (seriousData && seriousData.length > 0) {
      const profilesWithDetails = await Promise.all(
        seriousData.map(async (sp) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('id, full_name, display_name, date_of_birth, gender, city, country, occupation, education, height_cm, verification_status, bio')
            .eq('id', sp.user_id)
            .eq('serious_mode_enabled', true)
            .single();

          if (!profile) return null;

          const { data: photos } = await supabase
            .from('user_photos')
            .select('id, photo_url, is_primary')
            .eq('user_id', sp.user_id)
            .order('order_index');

          return {
            ...sp,
            profile,
            photos: photos || [],
          } as SeriousProfileWithDetails;
        })
      );

      setProfiles(profilesWithDetails.filter(Boolean) as SeriousProfileWithDetails[]);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchSeriousProfile();
      fetchProfiles();
    }
  }, [user, fetchSeriousProfile, fetchProfiles]);

  const updateSeriousProfile = async (updates: Partial<SeriousProfile>) => {
    if (!user) return { error: new Error('Not authenticated') };

    // Check if profile exists
    if (seriousProfile) {
      const { error } = await supabase
        .from('serious_profiles')
        .update(updates as any)
        .eq('user_id', user.id);

      if (!error) {
        setSeriousProfile(prev => prev ? { ...prev, ...updates } : null);
      }
      return { error };
    } else {
      // Create new profile
      const insertData = {
        user_id: user.id,
        ...defaultSeriousProfile,
        ...updates,
      };
      
      const { data, error } = await supabase
        .from('serious_profiles')
        .insert(insertData as any)
        .select()
        .single();

      if (!error && data) {
        setSeriousProfile(data as SeriousProfile);
      }
      return { error };
    }
  };

  const expressInterest = async (receiverId: string, message?: string) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('interest_expressions')
      .insert({
        sender_id: user.id,
        receiver_id: receiverId,
        message,
        status: 'pending',
      });

    if (!error) {
      setProfiles(prev => prev.filter(p => p.user_id !== receiverId));
    }

    return { error };
  };

  const respondToInterest = async (expressionId: string, accept: boolean) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('interest_expressions')
      .update({
        status: accept ? 'accepted' : 'declined',
        responded_at: new Date().toISOString(),
      })
      .eq('id', expressionId);

    return { error };
  };

  return {
    seriousProfile,
    profiles,
    loading,
    profileLoading,
    updateSeriousProfile,
    expressInterest,
    respondToInterest,
    refetchProfiles: fetchProfiles,
    refetchSeriousProfile: fetchSeriousProfile,
  };
}
