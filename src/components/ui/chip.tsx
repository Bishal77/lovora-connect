import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface ChipProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  selected?: boolean;
  removable?: boolean;
  onRemove?: () => void;
}

const Chip = React.forwardRef<HTMLDivElement, ChipProps>(
  (
    {
      className,
      variant = "default",
      size = "md",
      selected,
      removable,
      onRemove,
      children,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      default: selected
        ? "bg-primary text-primary-foreground"
        : "bg-muted text-muted-foreground hover:bg-muted/80",
      primary: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
      outline: selected
        ? "border-2 border-primary bg-primary/10 text-primary"
        : "border-2 border-border bg-transparent hover:border-primary/50",
    };

    const sizeClasses = {
      sm: "px-2 py-0.5 text-xs gap-1",
      md: "px-3 py-1 text-sm gap-1.5",
      lg: "px-4 py-1.5 text-base gap-2",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full font-medium transition-all duration-200 cursor-pointer",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
        {removable && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemove?.();
            }}
            className="ml-0.5 hover:text-destructive transition-colors"
          >
            <X className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
          </button>
        )}
      </div>
    );
  }
);
Chip.displayName = "Chip";

export { Chip };
