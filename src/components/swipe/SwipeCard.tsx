import { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { MapPin, Briefcase, GraduationCap, Info } from 'lucide-react';
import { ProfileWithDetails } from '@/hooks/useMatching';
import { cn } from '@/lib/utils';

interface Props {
  profile: ProfileWithDetails;
  onSwipe: (direction: 'left' | 'right' | 'up') => void;
  isTop: boolean;
}

export function SwipeCard({ profile, onSwipe, isTop }: Props) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const likeOpacity = useTransform(x, [0, 100], [0, 1]);
  const nopeOpacity = useTransform(x, [-100, 0], [1, 0]);
  const superLikeOpacity = useTransform(y, [-100, 0], [1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 100;
    
    if (info.offset.y < -threshold) {
      onSwipe('up');
    } else if (info.offset.x > threshold) {
      onSwipe('right');
    } else if (info.offset.x < -threshold) {
      onSwipe('left');
    }
  };

  const age = profile.date_of_birth 
    ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear()
    : null;

  const primaryPhoto = profile.photos.find(p => p.is_primary) || profile.photos[0];
  const photoUrl = primaryPhoto?.photo_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop';

  return (
    <motion.div
      className={cn(
        "absolute w-full h-full rounded-3xl overflow-hidden shadow-2xl",
        !isTop && "pointer-events-none"
      )}
      style={{ x, y, rotate }}
      drag={isTop}
      dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      initial={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.5 }}
      animate={{ scale: isTop ? 1 : 0.95, opacity: isTop ? 1 : 0.7 }}
    >
      {/* Photo */}
      <div className="absolute inset-0">
        <img
          src={photoUrl}
          alt={profile.full_name}
          className="w-full h-full object-cover"
        />
        
        {/* Photo indicators */}
        {profile.photos.length > 1 && (
          <div className="absolute top-4 left-4 right-4 flex gap-1">
            {profile.photos.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  index === currentPhotoIndex ? "bg-white" : "bg-white/40"
                )}
              />
            ))}
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </div>

      {/* Swipe indicators */}
      <motion.div
        className="absolute top-20 left-6 px-4 py-2 bg-green-500 rounded-lg rotate-[-20deg] border-4 border-green-500"
        style={{ opacity: likeOpacity }}
      >
        <span className="text-white font-bold text-2xl">LIKE</span>
      </motion.div>
      
      <motion.div
        className="absolute top-20 right-6 px-4 py-2 bg-red-500 rounded-lg rotate-[20deg] border-4 border-red-500"
        style={{ opacity: nopeOpacity }}
      >
        <span className="text-white font-bold text-2xl">NOPE</span>
      </motion.div>
      
      <motion.div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 px-4 py-2 bg-blue-500 rounded-lg border-4 border-blue-500"
        style={{ opacity: superLikeOpacity }}
      >
        <span className="text-white font-bold text-2xl">SUPER LIKE</span>
      </motion.div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="flex items-end justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-3xl font-bold">
                {profile.display_name || profile.full_name.split(' ')[0]}
              </h2>
              {age && <span className="text-2xl">{age}</span>}
            </div>
            
            {profile.city && (
              <div className="flex items-center gap-1 text-white/80">
                <MapPin className="h-4 w-4" />
                <span>{profile.city}</span>
              </div>
            )}
            
            {profile.occupation && (
              <div className="flex items-center gap-1 text-white/80">
                <Briefcase className="h-4 w-4" />
                <span>{profile.occupation}</span>
              </div>
            )}

            {/* Interests */}
            {profile.interests.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {profile.interests.slice(0, 4).map((interest) => (
                  <span
                    key={interest.id}
                    className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm"
                  >
                    {interest.icon} {interest.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setShowInfo(!showInfo)}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <Info className="h-5 w-5" />
          </button>
        </div>

        {/* Bio */}
        {showInfo && profile.bio && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl"
          >
            <p className="text-sm">{profile.bio}</p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
