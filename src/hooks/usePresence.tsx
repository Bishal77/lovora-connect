import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface PresenceState {
  [key: string]: {
    user_id: string;
    online_at: string;
    status: 'online' | 'away' | 'offline';
  }[];
}

export function usePresence() {
  const { user } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;

    // Update profile to online
    const updateOnlineStatus = async (isOnline: boolean) => {
      await supabase
        .from('profiles')
        .update({ 
          is_online: isOnline, 
          last_seen: new Date().toISOString() 
        })
        .eq('id', user.id);
    };

    updateOnlineStatus(true);

    // Set up presence channel
    const channel = supabase.channel('online-users', {
      config: {
        presence: {
          key: user.id,
        },
      },
    });

    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState() as PresenceState;
        const users = Object.keys(state);
        setOnlineUsers(users);
        console.log('Online users:', users);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
        setOnlineUsers(prev => [...new Set([...prev, key])]);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
        setOnlineUsers(prev => prev.filter(id => id !== key));
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: user.id,
            online_at: new Date().toISOString(),
            status: 'online'
          });
        }
      });

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        channel.track({
          user_id: user.id,
          online_at: new Date().toISOString(),
          status: 'away'
        });
      } else {
        channel.track({
          user_id: user.id,
          online_at: new Date().toISOString(),
          status: 'online'
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Handle beforeunload
    const handleBeforeUnload = () => {
      updateOnlineStatus(false);
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      updateOnlineStatus(false);
      supabase.removeChannel(channel);
    };
  }, [user]);

  const isUserOnline = (userId: string) => onlineUsers.includes(userId);

  return {
    onlineUsers,
    isUserOnline
  };
}