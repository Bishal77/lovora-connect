import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';
import { Match } from '@/hooks/useMatching';

interface Props {
  match: Match | null;
  onClose: () => void;
  onSendMessage: () => void;
}

export function MatchPopup({ match, onClose, onSendMessage }: Props) {
  if (!match?.other_user) return null;

  const photo = match.other_user.photos[0]?.photo_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop';

  return (
    <AnimatePresence>
      {match && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="relative bg-gradient-to-br from-primary/20 via-background to-pink-500/20 rounded-3xl p-8 max-w-sm w-full text-center"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>

            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-pink-500 bg-clip-text text-transparent mb-2">
                It's a Match!
              </h2>
              <p className="text-muted-foreground mb-6">
                You and {match.other_user.display_name || match.other_user.full_name} liked each other
              </p>
            </motion.div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring" }}
              className="flex justify-center mb-8"
            >
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary shadow-xl">
                  <img
                    src={photo}
                    alt={match.other_user.full_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary rounded-full flex items-center justify-center"
                >
                  <span className="text-2xl">💕</span>
                </motion.div>
              </div>
            </motion.div>

            <div className="space-y-3">
              <Button onClick={onSendMessage} className="w-full" size="lg">
                <MessageCircle className="mr-2 h-5 w-5" />
                Send a message
              </Button>
              <Button variant="ghost" onClick={onClose} className="w-full">
                Keep swiping
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
