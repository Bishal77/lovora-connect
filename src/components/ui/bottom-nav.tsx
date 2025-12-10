import * as React from "react";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Flame, Search, Heart, MessageCircle, User } from "lucide-react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { icon: Flame, label: "Home", path: "/home" },
  { icon: Search, label: "Discover", path: "/discover" },
  { icon: Heart, label: "Matches", path: "/matches" },
  { icon: MessageCircle, label: "Chat", path: "/chat" },
  { icon: User, label: "Profile", path: "/profile" },
];

interface BottomNavProps extends React.HTMLAttributes<HTMLElement> {
  badges?: Record<string, number>;
}

const BottomNav = React.forwardRef<HTMLElement, BottomNavProps>(
  ({ className, badges = {}, ...props }, ref) => {
    const location = useLocation();

    return (
      <nav
        ref={ref}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-t border-border safe-bottom",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-around h-16 px-2 max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path === "/home" && location.pathname === "/");
            const Icon = item.icon;
            const badgeCount = badges[item.path];

            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "relative flex flex-col items-center justify-center w-16 h-full transition-all duration-200",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="relative">
                  <Icon
                    className={cn(
                      "h-6 w-6 transition-transform duration-200",
                      isActive && "scale-110"
                    )}
                    fill={isActive ? "currentColor" : "none"}
                  />
                  {badgeCount && badgeCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                      {badgeCount > 9 ? "9+" : badgeCount}
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-xs mt-1 transition-all duration-200",
                    isActive ? "font-semibold" : "font-medium"
                  )}
                >
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute bottom-1 w-1 h-1 rounded-full bg-primary" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    );
  }
);
BottomNav.displayName = "BottomNav";

export { BottomNav };
