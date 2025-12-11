import { Heart, MapPin, Briefcase, GraduationCap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProfileWithDetails } from '@/hooks/useMatching';
import { cn } from '@/lib/utils';

interface Props {
  profile: ProfileWithDetails;
  onViewProfile: () => void;
  onExpressInterest: () => void;
}

export function DiscoverCard({ profile, onViewProfile, onExpressInterest }: Props) {
  const photo = profile.photos[0]?.photo_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=400&fit=crop';
  const age = profile.date_of_birth 
    ? new Date().getFullYear() - new Date(profile.date_of_birth).getFullYear()
    : null;

  const goalLabels = {
    casual: 'Something casual',
    serious: 'Serious relationship',
    marriage: 'Marriage',
    friendship: 'Friendship'
  };

  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border">
      {/* Photo */}
      <button onClick={onViewProfile} className="w-full aspect-[4/3] relative">
        <img src={photo} alt={profile.full_name} className="w-full h-full object-cover" />
        {profile.verification_status === 'verified' && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-blue-500 rounded-full flex items-center gap-1">
            <Star className="h-3 w-3 text-white" fill="white" />
            <span className="text-xs text-white font-medium">Verified</span>
          </div>
        )}
      </button>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg">
              {profile.display_name || profile.full_name}
              {age && <span className="text-muted-foreground ml-1">{age}</span>}
            </h3>
            {profile.city && (
              <div className="flex items-center gap-1 text-muted-foreground text-sm">
                <MapPin className="h-3 w-3" />
                <span>{profile.city}</span>
              </div>
            )}
          </div>
          
          {profile.relationship_goal && (
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              {goalLabels[profile.relationship_goal]}
            </span>
          )}
        </div>

        {/* Quick info */}
        <div className="space-y-1.5 mb-4">
          {profile.occupation && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <span>{profile.occupation}</span>
            </div>
          )}
          {profile.education && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GraduationCap className="h-4 w-4" />
              <span className="capitalize">{profile.education.replace('_', ' ')}</span>
            </div>
          )}
        </div>

        {/* Interests */}
        {profile.interests.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {profile.interests.slice(0, 3).map((interest) => (
              <span
                key={interest.id}
                className="px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full"
              >
                {interest.icon} {interest.name}
              </span>
            ))}
            {profile.interests.length > 3 && (
              <span className="px-2 py-0.5 text-xs text-muted-foreground">
                +{profile.interests.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={onViewProfile}>
            View Profile
          </Button>
          <Button className="flex-1" onClick={onExpressInterest}>
            <Heart className="mr-2 h-4 w-4" />
            Interested
          </Button>
        </div>
      </div>
    </div>
  );
}
