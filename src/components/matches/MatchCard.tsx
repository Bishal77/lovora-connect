import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { AvatarProfile } from '@/components/ui/avatar-profile';
import { Match } from '@/hooks/useMatching';
import { cn } from '@/lib/utils';

interface Props {
  match: Match;
  onClick: () => void;
}

export function MatchCard({ match, onClick }: Props) {
  if (!match.other_user) return null;

  const photo = match.other_user.photos[0]?.photo_url;
  const name = match.other_user.display_name || match.other_user.full_name.split(' ')[0];

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-2"
    >
      <div className="relative">
        <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-primary">
          {photo ? (
            <img src={photo} alt={name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center text-2xl">
              {name[0]}
            </div>
          )}
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
          <MessageCircle className="h-3 w-3 text-primary-foreground" />
        </div>
      </div>
      <span className="text-sm font-medium truncate max-w-[80px]">{name}</span>
    </motion.button>
  );
}
