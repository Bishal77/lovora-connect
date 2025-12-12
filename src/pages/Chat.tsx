import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ChatRoom } from "@/components/chat/ChatRoom";
import { useMatching } from "@/hooks/useMatching";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import { AvatarProfile } from "@/components/ui/avatar-profile";
import { MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const Chat: React.FC = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { matches, loading } = useMatching();
  const { messages, sendMessage } = useChat(matchId || '');

  if (matchId) {
    const match = matches.find(m => m.id === matchId);
    if (!match || !match.other_user) {
      return (
        <AppLayout>
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Conversation not found</p>
          </div>
        </AppLayout>
      );
    }
    
    const otherUser = {
      id: match.other_user.id,
      full_name: match.other_user.full_name,
      display_name: match.other_user.display_name,
      photo_url: match.other_user.photos?.[0]?.photo_url,
      is_online: match.other_user.is_online || false
    };
    
    return (
      <ChatRoom 
        messages={messages}
        otherUser={otherUser}
        onSendMessage={(content) => sendMessage(content)}
        onBack={() => navigate('/chat')}
      />
    );
  }

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Messages</h1>
        </div>

        {matches.length > 0 ? (
          <div className="divide-y divide-border">
            {matches.map((match) => {
              const otherUser = match.other_user;
              if (!otherUser) return null;
              return (
                <button
                  key={match.id}
                  onClick={() => navigate(`/chat/${match.id}`)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left"
                >
                  <div className="relative">
                    <AvatarProfile
                      src={otherUser.photos?.[0]?.photo_url}
                      size="lg"
                    />
                    {otherUser.is_online && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{otherUser.display_name || otherUser.full_name}</span>
                      {match.matched_at && (
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(match.matched_at), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      Say hello! 👋
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <MessageCircle className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No conversations yet</h2>
            <p className="text-muted-foreground max-w-xs mx-auto">
              Start swiping to match with people and begin chatting!
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Chat;