import { motion } from 'framer-motion';
import { MessageCircle, Mic, Video, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type SessionType = 'text' | 'audio' | 'video';

interface Props {
  onSelect: (type: SessionType) => void;
  searching: boolean;
}

export function LiveModeSelector({ onSelect, searching }: Props) {
  const modes = [
    {
      type: 'text' as SessionType,
      icon: MessageCircle,
      title: 'Text Chat',
      description: 'Random text conversation',
      color: 'from-blue-500 to-blue-600'
    },
    {
      type: 'audio' as SessionType,
      icon: Mic,
      title: 'Voice Call',
      description: 'Random audio chat',
      color: 'from-green-500 to-green-600'
    },
    {
      type: 'video' as SessionType,
      icon: Video,
      title: 'Video Chat',
      description: 'Face-to-face video call',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Shuffle className="h-10 w-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Live Mode</h2>
        <p className="text-muted-foreground">
          Connect with random people instantly
        </p>
      </motion.div>

      <div className="w-full max-w-sm space-y-4">
        {modes.map((mode, index) => (
          <motion.button
            key={mode.type}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => onSelect(mode.type)}
            disabled={searching}
            className={cn(
              "w-full p-4 rounded-2xl bg-card border border-border flex items-center gap-4 hover:border-primary transition-all disabled:opacity-50",
              searching && "animate-pulse"
            )}
          >
            <div className={cn(
              "w-14 h-14 rounded-xl bg-gradient-to-br flex items-center justify-center",
              mode.color
            )}>
              <mode.icon className="h-7 w-7 text-white" />
            </div>
            <div className="text-left flex-1">
              <h3 className="font-semibold">{mode.title}</h3>
              <p className="text-sm text-muted-foreground">{mode.description}</p>
            </div>
          </motion.button>
        ))}
      </div>

      <p className="text-xs text-muted-foreground mt-8 text-center max-w-xs">
        You'll be randomly matched with another user. Be respectful and have fun!
      </p>
    </div>
  );
}
