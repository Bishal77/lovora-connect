import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { ProfileWithDetails } from './useMatching';

export type SessionType = 'text' | 'audio' | 'video';

export interface LiveSession {
  id: string;
  user1_id: string | null;
  user2_id: string | null;
  session_type: SessionType;
  started_at: string;
  ended_at: string | null;
  is_active: boolean;
}

export interface LiveMessage {
  id: string;
  sender_id: string;
  content: string;
  timestamp: number;
}

export function useLiveMode() {
  const { user } = useAuth();
  const [inQueue, setInQueue] = useState(false);
  const [currentSession, setCurrentSession] = useState<LiveSession | null>(null);
  const [partner, setPartner] = useState<ProfileWithDetails | null>(null);
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [searching, setSearching] = useState(false);

  const joinQueue = async (sessionType: SessionType, preferredGender?: string[]) => {
    if (!user) return;
    setSearching(true);

    // Check if there's someone waiting
    const { data: waiting } = await supabase
      .from('live_queue')
      .select('*, profiles(*)')
      .eq('session_type', sessionType)
      .neq('user_id', user.id)
      .limit(1)
      .maybeSingle();

    if (waiting) {
      // Match found! Create session
      const { data: session, error } = await supabase
        .from('live_sessions')
        .insert({
          user1_id: waiting.user_id,
          user2_id: user.id,
          session_type: sessionType,
          is_active: true
        })
        .select()
        .single();

      if (!error && session) {
        // Remove from queue
        await supabase
          .from('live_queue')
          .delete()
          .eq('user_id', waiting.user_id);

        setCurrentSession(session as LiveSession);
        
        // Fetch partner details
        const { data: partnerData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', waiting.user_id)
          .single();

        if (partnerData) {
          const { data: photos } = await supabase
            .from('user_photos')
            .select('*')
            .eq('user_id', waiting.user_id);

          setPartner({
            ...partnerData,
            photos: photos || [],
            interests: []
          } as ProfileWithDetails);
        }
      }
    } else {
      // Add to queue
      await supabase
        .from('live_queue')
        .upsert({
          user_id: user.id,
          session_type: sessionType,
          preferred_gender: preferredGender as any || null
        }, { onConflict: 'user_id' });

      setInQueue(true);
    }
    setSearching(false);
  };

  const leaveQueue = async () => {
    if (!user) return;

    await supabase
      .from('live_queue')
      .delete()
      .eq('user_id', user.id);

    setInQueue(false);
  };

  const endSession = async () => {
    if (!currentSession) return;

    await supabase
      .from('live_sessions')
      .update({ is_active: false, ended_at: new Date().toISOString() })
      .eq('id', currentSession.id);

    setCurrentSession(null);
    setPartner(null);
    setMessages([]);
  };

  const skipToNext = async (sessionType: SessionType) => {
    await endSession();
    await joinQueue(sessionType);
  };

  // Listen for incoming sessions
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('live-sessions')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'live_sessions',
          filter: `user1_id=eq.${user.id}`
        },
        async (payload) => {
          const session = payload.new as LiveSession;
          setCurrentSession(session);
          setInQueue(false);

          // Fetch partner
          if (session.user2_id) {
            const { data: partnerData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user2_id)
              .single();

            if (partnerData) {
              const { data: photos } = await supabase
                .from('user_photos')
                .select('*')
                .eq('user_id', session.user2_id);

              setPartner({
                ...partnerData,
                photos: photos || [],
                interests: []
              } as ProfileWithDetails);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (inQueue && user) {
        supabase.from('live_queue').delete().eq('user_id', user.id);
      }
    };
  }, [inQueue, user]);

  const sendLiveMessage = (content: string) => {
    if (!user) return;
    
    const message: LiveMessage = {
      id: crypto.randomUUID(),
      sender_id: user.id,
      content,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, message]);
  };

  return {
    inQueue,
    currentSession,
    partner,
    messages,
    searching,
    joinQueue,
    leaveQueue,
    endSession,
    skipToNext,
    sendLiveMessage
  };
}
