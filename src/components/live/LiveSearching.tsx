import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface Props {
  type: 'text' | 'audio' | 'video';
  onCancel: () => void;
}

export function LiveSearching({ type, onCancel }: Props) {
  const typeLabels = {
    text: 'text chat',
    audio: 'voice call',
    video: 'video chat'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="relative mb-8"
      >
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary/20 to-pink-500/20 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/40 to-pink-500/40 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center">
              <span className="text-3xl">🔍</span>
            </div>
          </div>
        </div>
        
        {/* Animated rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-primary/30"
            animate={{
              scale: [1, 2],
              opacity: [0.5, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.6
            }}
          />
        ))}
      </motion.div>

      <h2 className="text-xl font-semibold mb-2">Searching...</h2>
      <p className="text-muted-foreground text-center mb-8">
        Finding someone for a {typeLabels[type]}
      </p>

      <Button variant="outline" onClick={onCancel}>
        <X className="mr-2 h-4 w-4" />
        Cancel
      </Button>
    </div>
  );
}
