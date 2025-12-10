import * as React from "react";
import { cn } from "@/lib/utils";
import { User } from "lucide-react";

interface AvatarProfileProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  online?: boolean;
  verified?: boolean;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
  xl: "h-24 w-24",
  "2xl": "h-32 w-32",
};

const badgeSizes = {
  sm: "h-2.5 w-2.5 border",
  md: "h-3 w-3 border-2",
  lg: "h-4 w-4 border-2",
  xl: "h-5 w-5 border-2",
  "2xl": "h-6 w-6 border-2",
};

const iconSizes = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
  "2xl": "h-16 w-16",
};

const AvatarProfile = React.forwardRef<HTMLDivElement, AvatarProfileProps>(
  ({ className, src, alt = "Profile", size = "md", online, verified, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    return (
      <div ref={ref} className={cn("relative inline-block", className)} {...props}>
        <div
          className={cn(
            "rounded-full overflow-hidden bg-muted flex items-center justify-center",
            sizeClasses[size]
          )}
        >
          {src && !imageError ? (
            <img
              src={src}
              alt={alt}
              className="h-full w-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <User className={cn("text-muted-foreground", iconSizes[size])} />
          )}
        </div>
        
        {/* Online indicator */}
        {online !== undefined && (
          <span
            className={cn(
              "absolute bottom-0 right-0 rounded-full border-background",
              online ? "bg-success" : "bg-muted-foreground",
              badgeSizes[size]
            )}
          />
        )}
        
        {/* Verified badge */}
        {verified && (
          <span
            className={cn(
              "absolute -top-0.5 -right-0.5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs",
              size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5"
            )}
          >
            ✓
          </span>
        )}
      </div>
    );
  }
);
AvatarProfile.displayName = "AvatarProfile";

export { AvatarProfile };
