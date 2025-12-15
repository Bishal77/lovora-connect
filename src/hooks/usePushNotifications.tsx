import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export function usePushNotifications() {
  const { user } = useAuth();
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Check if push notifications are supported
    const supported = 'Notification' in window && 'serviceWorker' in navigator;
    setIsSupported(supported);
    
    if (supported) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async (): Promise<boolean> => {
    if (!isSupported) {
      toast.error('Push notifications are not supported in this browser');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      
      if (result === 'granted') {
        toast.success('Notifications enabled!');
        return true;
      } else if (result === 'denied') {
        toast.error('Notification permission denied');
        return false;
      }
      return false;
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Failed to request notification permission');
      return false;
    }
  };

  const showNotification = useCallback((title: string, options?: NotificationOptions) => {
    if (permission !== 'granted') {
      console.warn('Notification permission not granted');
      return;
    }

    try {
      new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }, [permission]);

  const notifyNewMatch = useCallback((matchName: string) => {
    showNotification("It's a Match! 💕", {
      body: `You and ${matchName} liked each other!`,
      tag: 'new-match',
    });
  }, [showNotification]);

  const notifyNewMessage = useCallback((senderName: string, message: string) => {
    showNotification(`New message from ${senderName}`, {
      body: message.length > 50 ? message.substring(0, 50) + '...' : message,
      tag: 'new-message',
    });
  }, [showNotification]);

  // Subscribe to realtime notifications when user is logged in
  useEffect(() => {
    if (!user || permission !== 'granted') return;

    // Listen for new matches
    const matchChannel = supabase
      .channel('push-matches')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'matches',
          filter: `user2_id=eq.${user.id}`
        },
        async (payload) => {
          // Fetch the other user's name
          const otherUserId = payload.new.user1_id;
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, display_name')
            .eq('id', otherUserId)
            .single();

          if (profile) {
            notifyNewMatch(profile.display_name || profile.full_name);
          }
        }
      )
      .subscribe();

    // Listen for new messages
    const messageChannel = supabase
      .channel('push-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        async (payload) => {
          // Only notify if the message is not from the current user
          if (payload.new.sender_id === user.id) return;

          // Fetch sender's name
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, display_name')
            .eq('id', payload.new.sender_id)
            .single();

          if (profile) {
            notifyNewMessage(
              profile.display_name || profile.full_name,
              payload.new.content
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(matchChannel);
      supabase.removeChannel(messageChannel);
    };
  }, [user, permission, notifyNewMatch, notifyNewMessage]);

  return {
    isSupported,
    permission,
    isSubscribed,
    requestPermission,
    showNotification,
    notifyNewMatch,
    notifyNewMessage,
  };
}
