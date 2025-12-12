import React from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { AvatarProfile } from "@/components/ui/avatar-profile";
import { useMatching } from "@/hooks/useMatching";
import { useAuth } from "@/hooks/useAuth";
import { Heart, MessageCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const Matches: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { matches, loading } = useMatching();

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-muted-foreground">Loading matches...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Matches</h1>
          <span className="text-sm text-muted-foreground">{matches.length} matches</span>
        </div>

        {/* New Matches */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            New Matches
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {matches.slice(0, 5).map((match) => {
              const otherUser = match.other_user;
              if (!otherUser) return null;
              return (
                <div 
                  key={match.id} 
                  className="flex flex-col items-center gap-2 cursor-pointer"
                  onClick={() => navigate(`/chat/${match.id}`)}
                >
                  <div className="relative">
                    <AvatarProfile 
                      src={otherUser.photos?.[0]?.photo_url} 
                      size="lg" 
                    />
                    <span className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-1 rounded-full">
                      <Heart className="h-3 w-3" fill="currentColor" />
                    </span>
                  </div>
                  <span className="text-sm font-medium">{otherUser.full_name?.split(' ')[0]}</span>
                </div>
              );
            })}
            {matches.length === 0 && (
              <p className="text-muted-foreground text-sm">No matches yet. Keep swiping!</p>
            )}
          </div>
        </div>

        {/* Conversations */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Messages
          </h2>
          {matches.length > 0 ? (
            <div className="space-y-2">
              {matches.map((match) => {
                const otherUser = match.other_user;
                if (!otherUser) return null;
                return (
                  <div
                    key={match.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-card hover:bg-accent cursor-pointer transition-colors"
                    onClick={() => navigate(`/chat/${match.id}`)}
                  >
                    <AvatarProfile 
                      src={otherUser.photos?.[0]?.photo_url} 
                      size="md" 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{otherUser.full_name}</span>
                        <span className="text-xs text-muted-foreground">
                          {match.matched_at && formatDistanceToNow(new Date(match.matched_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        Say hi to {otherUser.full_name?.split(' ')[0]}! 👋
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
              <p className="text-muted-foreground">
                When you match with someone, you can message them here.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default Matches;