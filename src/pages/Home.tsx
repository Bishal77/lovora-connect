import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/layout/AppLayout";
import { ProfileCard } from "@/components/ui/profile-card";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import {
  Heart,
  X,
  Star,
  RotateCcw,
  SlidersHorizontal,
  Flame,
  Video,
  Users,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

// Demo profiles for swipe mode
const demoProfiles = [
  {
    id: "1",
    name: "Sarah",
    age: 25,
    photos: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop",
    ],
    location: "New York, NY",
    occupation: "Designer",
    bio: "Coffee lover ☕ | Art enthusiast 🎨 | Looking for someone to explore the city with",
    interests: ["Art", "Coffee", "Travel", "Photography", "Music"],
    distance: "2 miles away",
    verified: true,
  },
  {
    id: "2",
    name: "Emily",
    age: 28,
    photos: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop",
    ],
    location: "Brooklyn, NY",
    occupation: "Software Engineer",
    bio: "Tech geek by day, yoga instructor by weekend. Let's grab tacos! 🌮",
    interests: ["Yoga", "Tech", "Tacos", "Gaming", "Hiking"],
    distance: "5 miles away",
    verified: true,
  },
  {
    id: "3",
    name: "Jessica",
    age: 24,
    photos: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop",
    ],
    location: "Manhattan, NY",
    occupation: "Marketing Manager",
    bio: "Wine enthusiast 🍷 | Book worm 📚 | Always up for an adventure",
    interests: ["Wine", "Books", "Travel", "Fitness", "Cooking"],
    distance: "3 miles away",
  },
];

type SwipeMode = "swipe" | "serious" | "live";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<SwipeMode>("swipe");
  const [user, setUser] = useState<any>(null);

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

  const handleSwipe = (direction: "left" | "right" | "up") => {
    setSwipeDirection(direction);
    setTimeout(() => {
      setSwipeDirection(null);
      setCurrentIndex((prev) => (prev + 1) % demoProfiles.length);
    }, 300);
  };

  const currentProfile = demoProfiles[currentIndex];

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
            <Button variant="ghost" size="icon">
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
            {/* Card Stack */}
            <div className="relative w-full max-w-sm h-[500px] mb-6">
              {/* Background cards */}
              {demoProfiles.slice(currentIndex + 1, currentIndex + 3).map((profile, idx) => (
                <div
                  key={profile.id}
                  className="absolute inset-0"
                  style={{
                    transform: `scale(${1 - (idx + 1) * 0.05}) translateY(${(idx + 1) * 10}px)`,
                    zIndex: -idx - 1,
                    opacity: 1 - (idx + 1) * 0.2,
                  }}
                >
                  <ProfileCard {...profile} />
                </div>
              ))}

              {/* Current card */}
              <div
                className={cn(
                  "absolute inset-0 transition-transform duration-300",
                  swipeDirection === "left" && "swipe-left",
                  swipeDirection === "right" && "swipe-right",
                  swipeDirection === "up" && "swipe-up"
                )}
              >
                <ProfileCard {...currentProfile} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon-lg"
                onClick={() => handleSwipe("left")}
                className="rounded-full border-2 hover:border-destructive hover:text-destructive"
              >
                <X className="h-8 w-8" />
              </Button>

              <Button
                variant="outline"
                size="icon-xl"
                onClick={() => handleSwipe("up")}
                className="rounded-full border-2 border-warning text-warning hover:bg-warning hover:text-warning-foreground"
              >
                <Star className="h-10 w-10" />
              </Button>

              <Button
                variant="love"
                size="icon-xl"
                onClick={() => handleSwipe("right")}
                className="rounded-full"
              >
                <Heart className="h-10 w-10" fill="currentColor" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground"
              >
                <RotateCcw className="h-6 w-6" />
              </Button>
            </div>
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
    </AppLayout>
  );
};

export default Home;
