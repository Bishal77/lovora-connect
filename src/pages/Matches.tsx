import React from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { AvatarProfile } from "@/components/ui/avatar-profile";
import { Heart } from "lucide-react";

const Matches: React.FC = () => {
  // Demo matches
  const newMatches = [
    { id: "1", name: "Sarah", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" },
    { id: "2", name: "Emily", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop" },
  ];

  return (
    <AppLayout>
      <div className="px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Matches</h1>
          <span className="text-sm text-muted-foreground">{newMatches.length} new</span>
        </div>

        {/* New Matches */}
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            New Matches
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {newMatches.map((match) => (
              <div key={match.id} className="flex flex-col items-center gap-2">
                <div className="relative">
                  <AvatarProfile src={match.photo} size="lg" />
                  <span className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground p-1 rounded-full">
                    <Heart className="h-3 w-3" fill="currentColor" />
                  </span>
                </div>
                <span className="text-sm font-medium">{match.name}</span>
              </div>
            ))}
            {newMatches.length === 0 && (
              <p className="text-muted-foreground text-sm">No new matches yet. Keep swiping!</p>
            )}
          </div>
        </div>

        {/* Messages */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Messages
          </h2>
          <div className="text-center py-12">
            <Heart className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground">
              When you match with someone, you can message them here.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Matches;
