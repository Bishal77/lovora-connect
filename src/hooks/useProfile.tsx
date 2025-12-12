import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Profile {
  id: string;
  email: string | null;
  phone: string | null;
  full_name: string;
  display_name: string | null;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  bio: string | null;
  city: string | null;
  country: string | null;
  latitude: number | null;
  longitude: number | null;
  occupation: string | null;
  company: string | null;
  education: string | null;
  school: string | null;
  relationship_goal: 'casual' | 'serious' | 'marriage' | 'friendship';
  height_cm: number | null;
  is_online: boolean;
  last_seen: string;
  verification_status: 'none' | 'pending' | 'verified' | 'rejected';
  is_premium: boolean;
  swipe_mode_enabled: boolean;
  serious_mode_enabled: boolean;
  live_mode_enabled: boolean;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserPhoto {
  id: string;
  user_id: string;
  photo_url: string;
  is_primary: boolean;
  order_index: number;
}

export interface Interest {
  id: string;
  name: string;
  category: string | null;
  icon: string | null;
}

export function useProfile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [photos, setPhotos] = useState<UserPhoto[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [userInterests, setUserInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchPhotos();
      fetchInterests();
      fetchUserInterests();
    } else {
      setProfile(null);
      setPhotos([]);
      setUserInterests([]);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (!error && data) {
      setProfile(data as Profile);
    }
    setLoading(false);
  };

  const fetchPhotos = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('user_photos')
      .select('*')
      .eq('user_id', user.id)
      .order('order_index');

    if (data) setPhotos(data as UserPhoto[]);
  };

  const fetchInterests = async () => {
    const { data } = await supabase
      .from('interests')
      .select('*')
      .order('name');

    if (data) setInterests(data as Interest[]);
  };

  const fetchUserInterests = async () => {
    if (!user) return;
    
    const { data } = await supabase
      .from('user_interests')
      .select('interest_id, interests(*)')
      .eq('user_id', user.id);

    if (data) {
      const mapped = data.map((item: any) => item.interests as Interest);
      setUserInterests(mapped);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('profiles')
      .update(updates as any)
      .eq('id', user.id);

    if (!error) {
      setProfile(prev => prev ? { ...prev, ...updates } : null);
    }
    return { error };
  };

  const uploadPhoto = async (file: File, isPrimary = false) => {
    if (!user) return { error: new Error('Not authenticated'), url: null };

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, file);

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { error: uploadError, url: null };
    }

    const { data: { publicUrl } } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(fileName);

    // Add to user_photos table
    const orderIndex = photos.length;
    const { data, error } = await supabase
      .from('user_photos')
      .insert({
        user_id: user.id,
        photo_url: publicUrl,
        is_primary: isPrimary || photos.length === 0,
        order_index: orderIndex
      })
      .select()
      .single();

    if (!error && data) {
      setPhotos(prev => [...prev, data as UserPhoto]);
    }

    return { data, error, url: publicUrl };
  };

  const addPhoto = async (photoUrl: string, isPrimary = false) => {
    if (!user) return { error: new Error('Not authenticated') };

    const orderIndex = photos.length;
    const { data, error } = await supabase
      .from('user_photos')
      .insert({
        user_id: user.id,
        photo_url: photoUrl,
        is_primary: isPrimary,
        order_index: orderIndex
      })
      .select()
      .single();

    if (!error && data) {
      setPhotos(prev => [...prev, data as UserPhoto]);
    }
    return { data, error };
  };

  const removePhoto = async (photoId: string) => {
    const { error } = await supabase
      .from('user_photos')
      .delete()
      .eq('id', photoId);

    if (!error) {
      setPhotos(prev => prev.filter(p => p.id !== photoId));
    }
    return { error };
  };

  const toggleInterest = async (interestId: string) => {
    if (!user) return;

    const exists = userInterests.some(i => i.id === interestId);
    
    if (exists) {
      await supabase
        .from('user_interests')
        .delete()
        .eq('user_id', user.id)
        .eq('interest_id', interestId);
      
      setUserInterests(prev => prev.filter(i => i.id !== interestId));
    } else {
      await supabase
        .from('user_interests')
        .insert({ user_id: user.id, interest_id: interestId });
      
      const interest = interests.find(i => i.id === interestId);
      if (interest) {
        setUserInterests(prev => [...prev, interest]);
      }
    }
  };

  return {
    profile,
    photos,
    interests,
    userInterests,
    loading,
    updateProfile,
    uploadPhoto,
    addPhoto,
    removePhoto,
    toggleInterest,
    refetch: fetchProfile
  };
}
