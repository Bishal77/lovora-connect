import { X, Heart, Star, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  onSwipe: (direction: 'left' | 'right' | 'up') => void;
  onUndo?: () => void;
  canUndo?: boolean;
}

export function SwipeActions({ onSwipe, onUndo, canUndo }: Props) {
  const buttons = [
    {
      icon: RotateCcw,
      onClick: onUndo,
      disabled: !canUndo,
      className: "w-12 h-12 bg-card border border-border text-amber-500",
      iconSize: "h-5 w-5"
    },
    {
      icon: X,
      onClick: () => onSwipe('left'),
      className: "w-16 h-16 bg-card border border-border text-destructive",
      iconSize: "h-8 w-8"
    },
    {
      icon: Star,
      onClick: () => onSwipe('up'),
      className: "w-12 h-12 bg-card border border-border text-blue-500",
      iconSize: "h-5 w-5"
    },
    {
      icon: Heart,
      onClick: () => onSwipe('right'),
      className: "w-16 h-16 bg-card border border-border text-primary",
      iconSize: "h-8 w-8"
    }
  ];

  return (
    <div className="flex items-center justify-center gap-4">
      {buttons.map((button, index) => (
        <button
          key={index}
          onClick={button.onClick}
          disabled={button.disabled}
          className={cn(
            "rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95 disabled:opacity-50 disabled:hover:scale-100",
            button.className
          )}
        >
          <button.icon className={button.iconSize} />
        </button>
      ))}
    </div>
  );
}
