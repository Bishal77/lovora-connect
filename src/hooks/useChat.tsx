import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: string;
  is_read: boolean;
  created_at: string;
}

export interface Conversation {
  id: string;
  match_id: string;
  created_at: string;
  updated_at: string;
  messages?: Message[];
  other_user?: {
    id: string;
    full_name: string;
    display_name: string | null;
    photo_url?: string;
    is_online: boolean;
  };
  last_message?: Message;
  unread_count?: number;
}

export function useChat(matchId?: string) {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    if (!user) return;

    const { data: matches } = await supabase
      .from('matches')
      .select('id, user1_id, user2_id')
      .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
      .eq('is_active', true);

    if (!matches) return;

    const conversationsData = await Promise.all(
      matches.map(async (match) => {
        const { data: conv } = await supabase
          .from('conversations')
          .select('*')
          .eq('match_id', match.id)
          .maybeSingle();

        if (!conv) return null;

        const otherUserId = match.user1_id === user.id ? match.user2_id : match.user1_id;
        
        const { data: otherUser } = await supabase
          .from('profiles')
          .select('id, full_name, display_name, is_online')
          .eq('id', otherUserId)
          .single();

        const { data: photo } = await supabase
          .from('user_photos')
          .select('photo_url')
          .eq('user_id', otherUserId)
          .eq('is_primary', true)
          .maybeSingle();

        const { data: lastMsg } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        const { count } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('conversation_id', conv.id)
          .eq('is_read', false)
          .neq('sender_id', user.id);

        return {
          ...conv,
          other_user: otherUser ? {
            ...otherUser,
            photo_url: photo?.photo_url
          } : undefined,
          last_message: lastMsg || undefined,
          unread_count: count || 0
        } as Conversation;
      })
    );

    setConversations(conversationsData.filter(Boolean) as Conversation[]);
    setLoading(false);
  }, [user]);

  const fetchMessages = useCallback(async (conversationId: string) => {
    const { data } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (data) {
      setMessages(data as Message[]);
    }
  }, []);

  const getConversationByMatchId = useCallback(async (matchId: string) => {
    const { data } = await supabase
      .from('conversations')
      .select('*')
      .eq('match_id', matchId)
      .maybeSingle();

    if (data) {
      setCurrentConversation(data as Conversation);
      fetchMessages(data.id);
      return data as Conversation;
    }
    return null;
  }, [fetchMessages]);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user, fetchConversations]);

  useEffect(() => {
    if (matchId && user) {
      getConversationByMatchId(matchId);
    }
  }, [matchId, user, getConversationByMatchId]);

  useEffect(() => {
    if (!currentConversation) return;

    const channel = supabase
      .channel(`messages-${currentConversation.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${currentConversation.id}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentConversation]);

  const sendMessage = async (content: string) => {
    if (!user || !currentConversation) return { error: new Error('No conversation') };

    const { error } = await supabase
      .from('messages')
      .insert({
        conversation_id: currentConversation.id,
        sender_id: user.id,
        content,
        message_type: 'text'
      });

    return { error };
  };

  const markAsRead = async (messageId: string) => {
    await supabase
      .from('messages')
      .update({ is_read: true })
      .eq('id', messageId);
  };

  return {
    conversations,
    currentConversation,
    messages,
    loading,
    sendMessage,
    markAsRead,
    fetchConversations,
    getConversationByMatchId
  };
}
