import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProfileWithDetails } from '@/hooks/useMatching';
import { 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Heart, 
  Star, 
  X,
  ChevronLeft,
  ChevronRight,
  Ruler,
  Target,
  Building2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  profile: ProfileWithDetails | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwipe?: (direction: 'left' | 'right' | 'up') => void;
}

export function ProfileDetailSheet({ profile, open, onOpenChange, onSwipe }: Props) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  if (!profile) return null;

  const age = profile.date_of_birth 
    ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear()
    : null;

  const photos = profile.photos.length > 0 
    ? profile.photos 
    : [{ id: 'default', photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop', is_primary: true, order_index: 0, user_id: profile.id, created_at: '' }];

  const currentPhoto = photos[currentPhotoIndex]?.photo_url;

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    onSwipe?.(direction);
    onOpenChange(false);
  };

  const getEducationLabel = (education: string | null) => {
    const labels: Record<string, string> = {
      high_school: 'High School',
      bachelors: "Bachelor's Degree",
      masters: "Master's Degree",
      doctorate: 'Doctorate',
      other: 'Other'
    };
    return education ? labels[education] || education : null;
  };

  const getRelationshipGoalLabel = (goal: string | null) => {
    const labels: Record<string, string> = {
      casual: 'Casual Dating',
      serious: 'Serious Relationship',
      marriage: 'Marriage',
      friendship: 'Friendship'
    };
    return goal ? labels[goal] || goal : null;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] p-0 rounded-t-3xl overflow-hidden">
        <div className="h-full overflow-y-auto">
          {/* Photo Gallery */}
          <div className="relative h-[50vh] min-h-[300px]">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentPhotoIndex}
                src={currentPhoto}
                alt={profile.full_name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </AnimatePresence>

            {/* Photo indicators */}
            {photos.length > 1 && (
              <div className="absolute top-4 left-4 right-4 flex gap-1">
                {photos.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-colors cursor-pointer",
                      index === currentPhotoIndex ? "bg-white" : "bg-white/40"
                    )}
                    onClick={() => setCurrentPhotoIndex(index)}
                  />
                ))}
              </div>
            )}

            {/* Photo navigation */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={prevPhoto}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={nextPhoto}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

            {/* Close button */}
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center z-10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 -mt-16 relative z-10">
            {/* Name and Age */}
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-3xl font-bold">
                {profile.display_name || profile.full_name.split(' ')[0]}
              </h2>
              {age && <span className="text-2xl text-muted-foreground">{age}</span>}
              {profile.verification_status === 'verified' && (
                <Badge variant="secondary" className="bg-success/20 text-success">
                  Verified
                </Badge>
              )}
            </div>

            {/* Basic Info */}
            <div className="space-y-3 mb-6">
              {profile.city && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>{profile.city}{profile.country ? `, ${profile.country}` : ''}</span>
                  {profile.distance_km && (
                    <span className="text-sm">• {Math.round(profile.distance_km)} km away</span>
                  )}
                </div>
              )}

              {profile.occupation && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="h-5 w-5 text-primary" />
                  <span>{profile.occupation}</span>
                  {profile.company && <span className="text-sm">at {profile.company}</span>}
                </div>
              )}

              {profile.education && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <span>{getEducationLabel(profile.education)}</span>
                  {profile.school && <span className="text-sm">• {profile.school}</span>}
                </div>
              )}

              {profile.height_cm && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Ruler className="h-5 w-5 text-primary" />
                  <span>{profile.height_cm} cm</span>
                </div>
              )}

              {profile.relationship_goal && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Target className="h-5 w-5 text-primary" />
                  <span>{getRelationshipGoalLabel(profile.relationship_goal)}</span>
                </div>
              )}
            </div>

            {/* Bio */}
            {profile.bio && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">About</h3>
                <p className="text-muted-foreground leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Interests */}
            {profile.interests.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest) => (
                    <Badge 
                      key={interest.id} 
                      variant="secondary"
                      className="px-4 py-2 text-sm"
                    >
                      {interest.icon} {interest.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {onSwipe && (
              <div className="flex items-center justify-center gap-4 pt-4 pb-8">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleSwipe('left')}
                  className="w-16 h-16 rounded-full border-2 hover:border-destructive hover:text-destructive"
                >
                  <X className="h-8 w-8" />
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => handleSwipe('up')}
                  className="w-14 h-14 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                >
                  <Star className="h-6 w-6" />
                </Button>

                <Button
                  size="lg"
                  onClick={() => handleSwipe('right')}
                  className="w-16 h-16 rounded-full bg-primary hover:bg-primary/90"
                >
                  <Heart className="h-8 w-8" fill="currentColor" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
