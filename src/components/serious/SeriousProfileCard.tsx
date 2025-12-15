import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SeriousProfileWithDetails } from '@/hooks/useSeriousMode';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  X,
  ChevronLeft,
  ChevronRight,
  Ruler,
  Users,
  Church,
  Languages,
  Home,
  CheckCircle2,
  Send,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  profile: SeriousProfileWithDetails;
  onExpressInterest: (message?: string) => void;
  onSkip: () => void;
}

export function SeriousProfileCard({ profile, onExpressInterest, onSkip }: Props) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showInterestDialog, setShowInterestDialog] = useState(false);
  const [message, setMessage] = useState('');

  const age = profile.profile.date_of_birth
    ? new Date().getFullYear() - new Date(profile.profile.date_of_birth).getFullYear()
    : null;

  const photos = profile.photos.length > 0
    ? profile.photos
    : [{ id: 'default', photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop', is_primary: true }];

  const currentPhoto = photos[currentPhotoIndex]?.photo_url;

  const getEducationLabel = (education: string | null) => {
    const labels: Record<string, string> = {
      high_school: 'High School',
      bachelors: "Bachelor's",
      masters: "Master's",
      doctorate: 'Doctorate',
    };
    return education ? labels[education] || education : null;
  };

  const handleSendInterest = () => {
    onExpressInterest(message || undefined);
    setShowInterestDialog(false);
    setMessage('');
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-card rounded-2xl overflow-hidden shadow-lg"
      >
        {/* Photo Gallery */}
        <div className="relative aspect-[4/5]">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentPhotoIndex}
              src={currentPhoto}
              alt={profile.profile.full_name}
              className="w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          </AnimatePresence>

          {/* Photo indicators */}
          {photos.length > 1 && (
            <>
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

              <button
                onClick={() => setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setCurrentPhotoIndex((prev) => (prev + 1) % photos.length)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Verified badge */}
          {profile.profile.verification_status === 'verified' && (
            <div className="absolute top-4 right-4 bg-success/90 text-white px-3 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-sm font-medium">Verified</span>
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        {/* Profile Info */}
        <div className="p-6 -mt-20 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <h2 className="text-2xl font-bold text-white">
              {profile.profile.display_name || profile.profile.full_name.split(' ')[0]}
            </h2>
            {age && <span className="text-xl text-white/80">{age}</span>}
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            {profile.profile.city && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm">{profile.profile.city}</span>
              </div>
            )}
            {profile.profile.occupation && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="h-4 w-4 text-primary" />
                <span className="text-sm">{profile.profile.occupation}</span>
              </div>
            )}
            {profile.profile.education && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <GraduationCap className="h-4 w-4 text-primary" />
                <span className="text-sm">{getEducationLabel(profile.profile.education)}</span>
              </div>
            )}
            {profile.profile.height_cm && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Ruler className="h-4 w-4 text-primary" />
                <span className="text-sm">{profile.profile.height_cm} cm</span>
              </div>
            )}
          </div>

          {/* Serious Profile Details */}
          <div className="space-y-3 mb-4">
            {profile.religion && (
              <div className="flex items-center gap-2">
                <Church className="h-4 w-4 text-primary" />
                <span className="text-sm">
                  {profile.religion}
                  {profile.caste && ` - ${profile.caste}`}
                </span>
              </div>
            )}
            {profile.mother_tongue && (
              <div className="flex items-center gap-2">
                <Languages className="h-4 w-4 text-primary" />
                <span className="text-sm">{profile.mother_tongue}</span>
              </div>
            )}
            {profile.family_type && (
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-primary" />
                <span className="text-sm">{profile.family_type} family</span>
              </div>
            )}
            {profile.siblings !== null && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span className="text-sm">{profile.siblings} sibling{profile.siblings !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>

          {/* Bio */}
          {profile.profile.bio && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {profile.profile.bio}
            </p>
          )}

          {/* Expectations */}
          {profile.expectations && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-1">Looking for:</h4>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {profile.expectations}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onSkip} className="flex-1">
              <X className="h-5 w-5 mr-2" />
              Skip
            </Button>
            <Button onClick={() => setShowInterestDialog(true)} className="flex-1">
              <Heart className="h-5 w-5 mr-2" />
              Express Interest
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Interest Dialog */}
      <Dialog open={showInterestDialog} onOpenChange={setShowInterestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Express Interest</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Send a personalized message to {profile.profile.display_name || profile.profile.full_name.split(' ')[0]}
            </p>
            <Textarea
              placeholder="Write a message introducing yourself... (optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
            />
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowInterestDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleSendInterest} className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Send Interest
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
