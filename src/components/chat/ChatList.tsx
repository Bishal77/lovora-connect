import { formatDistanceToNow } from 'date-fns';
import { AvatarProfile } from '@/components/ui/avatar-profile';
import { Conversation } from '@/hooks/useChat';
import { cn } from '@/lib/utils';

interface Props {
  conversations: Conversation[];
  onSelectConversation: (matchId: string) => void;
}

export function ChatList({ conversations, onSelectConversation }: Props) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <span className="text-3xl">💬</span>
        </div>
        <h3 className="font-semibold text-lg mb-2">No messages yet</h3>
        <p className="text-muted-foreground text-sm">
          When you match with someone, you can start chatting here!
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {conversations.map((conversation) => {
        if (!conversation.other_user) return null;
        
        return (
          <button
            key={conversation.id}
            onClick={() => onSelectConversation(conversation.match_id)}
            className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left"
          >
            <div className="relative">
              <AvatarProfile
                src={conversation.other_user.photo_url}
                alt={conversation.other_user.full_name}
                size="lg"
              />
              {conversation.other_user.is_online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-semibold truncate">
                  {conversation.other_user.display_name || conversation.other_user.full_name}
                </h4>
                {conversation.last_message && (
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(conversation.last_message.created_at), { addSuffix: true })}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <p className={cn(
                  "text-sm truncate flex-1",
                  conversation.unread_count && conversation.unread_count > 0
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                )}>
                  {conversation.last_message?.content || "Say hello! 👋"}
                </p>
                
                {conversation.unread_count && conversation.unread_count > 0 && (
                  <span className="w-5 h-5 bg-primary rounded-full text-primary-foreground text-xs flex items-center justify-center">
                    {conversation.unread_count}
                  </span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
