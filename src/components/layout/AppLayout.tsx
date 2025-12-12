import React from "react";
import { BottomNav } from "@/components/ui/bottom-nav";
import { cn } from "@/lib/utils";
import { usePresence } from "@/hooks/usePresence";

interface AppLayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
  className?: string;
  badges?: Record<string, number>;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  showNav = true,
  className,
  badges,
}) => {
  // Initialize presence tracking
  usePresence();

  return (
    <div className="min-h-screen bg-background">
      <main
        className={cn(
          "min-h-screen",
          showNav && "pb-20",
          className
        )}
      >
        {children}
      </main>
      {showNav && <BottomNav badges={badges} />}
    </div>
  );
};
