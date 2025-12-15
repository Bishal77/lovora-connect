import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AppLayout } from "@/components/layout/AppLayout";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { SwipeCard } from "@/components/swipe/SwipeCard";
import { SwipeActions } from "@/components/swipe/SwipeActions";
import { MatchPopup } from "@/components/swipe/MatchPopup";
import { ProfileDetailSheet } from "@/components/swipe/ProfileDetailSheet";
import { DiscoveryFilters, Filters } from "@/components/swipe/DiscoveryFilters";
import { useMatching, ProfileWithDetails } from "@/hooks/useMatching";
import {
  Heart,
  SlidersHorizontal,
  Flame,
  Video,
  Users,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type SwipeMode = "swipe" | "serious" | "live";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [activeMode, setActiveMode] = useState<SwipeMode>("swipe");
  const [user, setUser] = useState<any>(null);
  const [exitDirection, setExitDirection] = useState<string | null>(null);
  const [selectedProfile, setSelectedProfile] = useState<ProfileWithDetails | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const { 
    profiles, 
    loading, 
    newMatch, 
    swipe, 
    clearNewMatch, 
    refetchProfiles,
    undoLastSwipe,
    canUndo,
    filters,
    updateFilters
  } = useMatching();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
        return;
      }
      setUser(session.user);
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!session) {
          navigate("/");
        } else {
          setUser(session.user);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSwipe = async (profileId: string, direction: 'left' | 'right' | 'up') => {
    const action = direction === 'left' ? 'dislike' 
                 : direction === 'up' ? 'superlike' 
                 : 'like';
    
    setExitDirection(direction);
    await swipe(profileId, action);
    setExitDirection(null);
  };

  const handleUndo = async () => {
    const { error } = await undoLastSwipe();
    if (error) {
      toast.error("Can't undo right now");
    } else {
      toast.success("Swipe undone!");
    }
  };

  const handleSendMessage = () => {
    if (newMatch?.other_user) {
      clearNewMatch();
      navigate(`/chat`);
    }
  };

  const handleApplyFilters = (newFilters: Filters) => {
    updateFilters(newFilters);
    refetchProfiles();
  };

  const handleProfileSwipe = (direction: 'left' | 'right' | 'up') => {
    if (selectedProfile) {
      handleSwipe(selectedProfile.id, direction);
      setSelectedProfile(null);
    }
  };

  return (
    <AppLayout>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Flame className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl">Lovora</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowFilters(true)}
              className="relative"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mode Tabs */}
        <div className="flex px-4 pb-3 gap-2">
          {[
            { id: "swipe", label: "Swipe", icon: Flame },
            { id: "serious", label: "Serious", icon: Users },
            { id: "live", label: "Live", icon: Video },
          ].map((mode) => {
            const Icon = mode.icon;
            return (
              <Button
                key={mode.id}
                variant={activeMode === mode.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveMode(mode.id as SwipeMode)}
                className={cn(
                  "flex-1",
                  activeMode === mode.id && "shadow-glow"
                )}
              >
                <Icon className="h-4 w-4 mr-1" />
                {mode.label}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6">
        {activeMode === "swipe" && (
          <div className="flex flex-col items-center">
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center h-[500px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}

            {/* Empty State */}
            {!loading && profiles.length === 0 && (
              <div className="flex flex-col items-center justify-center h-[500px] text-center">
                <Heart className="h-16 w-16 text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">No More Profiles</h2>
                <p className="text-muted-foreground mb-6">
                  Check back later for new matches!
                </p>
                <Button onClick={() => refetchProfiles()}>
                  Refresh Profiles
                </Button>
              </div>
            )}

            {/* Card Stack */}
            {!loading && profiles.length > 0 && (
              <>
                <div className="relative w-full max-w-sm h-[500px] mb-6">
                  <AnimatePresence mode="popLayout">
                    {profiles.slice(0, 3).map((profile, index) => (
                      <motion.div
                        key={profile.id}
                        className="absolute inset-0"
                        initial={{ scale: 1 - index * 0.05, y: index * 10 }}
                        animate={{ scale: 1 - index * 0.05, y: index * 10 }}
                        exit={{
                          x: exitDirection === 'right' ? 500 : exitDirection === 'left' ? -500 : 0,
                          y: exitDirection === 'up' ? -500 : 0,
                          opacity: 0,
                          transition: { duration: 0.3 }
                        }}
                        style={{ zIndex: profiles.length - index }}
                      >
                        <SwipeCard
                          profile={profile}
                          isTop={index === 0}
                          onSwipe={(direction) => handleSwipe(profile.id, direction)}
                          onInfoClick={() => setSelectedProfile(profile)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Action Buttons */}
                <SwipeActions
                  onSwipe={(direction) => {
                    if (profiles.length > 0) {
                      handleSwipe(profiles[0].id, direction);
                    }
                  }}
                  onUndo={handleUndo}
                  canUndo={canUndo}
                />
              </>
            )}
          </div>
        )}

        {activeMode === "serious" && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Serious Mode</h2>
            <p className="text-muted-foreground">
              Detailed profiles for meaningful connections coming soon!
            </p>
          </div>
        )}

        {activeMode === "live" && (
          <div className="text-center py-12">
            <Video className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Live Mode</h2>
            <p className="text-muted-foreground mb-6">
              Random text, audio, and video chat coming soon!
            </p>
            <div className="flex flex-col gap-3 max-w-xs mx-auto">
              <Button variant="outline" size="lg" disabled>
                Random Text Chat
              </Button>
              <Button variant="outline" size="lg" disabled>
                Random Audio Chat
              </Button>
              <Button variant="gradient" size="lg" disabled>
                Random Video Chat
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Match Popup */}
      <MatchPopup
        match={newMatch}
        onClose={clearNewMatch}
        onSendMessage={handleSendMessage}
      />

      {/* Profile Detail Sheet */}
      <ProfileDetailSheet
        profile={selectedProfile}
        open={!!selectedProfile}
        onOpenChange={(open) => !open && setSelectedProfile(null)}
        onSwipe={handleProfileSwipe}
      />

      {/* Discovery Filters */}
      <DiscoveryFilters
        open={showFilters}
        onOpenChange={setShowFilters}
        onApply={handleApplyFilters}
        currentFilters={filters}
      />
    </AppLayout>
  );
};

export default Home;
