import * as React from "react";
import { cn } from "@/lib/utils";
import { MapPin, Briefcase, GraduationCap, Heart } from "lucide-react";
import { Chip } from "./chip";

interface ProfileCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  age: number;
  photos: string[];
  location?: string;
  occupation?: string;
  education?: string;
  bio?: string;
  interests?: string[];
  distance?: string;
  compatibility?: number;
  verified?: boolean;
  onPhotoChange?: (index: number) => void;
}

const ProfileCard = React.forwardRef<HTMLDivElement, ProfileCardProps>(
  (
    {
      className,
      name,
      age,
      photos,
      location,
      occupation,
      education,
      bio,
      interests = [],
      distance,
      compatibility,
      verified,
      onPhotoChange,
      ...props
    },
    ref
  ) => {
    const [currentPhoto, setCurrentPhoto] = React.useState(0);

    const handlePhotoNav = (direction: "prev" | "next") => {
      const newIndex =
        direction === "next"
          ? (currentPhoto + 1) % photos.length
          : (currentPhoto - 1 + photos.length) % photos.length;
      setCurrentPhoto(newIndex);
      onPhotoChange?.(newIndex);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full max-w-sm mx-auto bg-card rounded-3xl overflow-hidden shadow-lg",
          className
        )}
        {...props}
      >
        {/* Photo Section */}
        <div className="relative aspect-[3/4] w-full">
          {photos.length > 0 ? (
            <img
              src={photos[currentPhoto]}
              alt={`${name}'s photo`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Heart className="h-16 w-16 text-muted-foreground" />
            </div>
          )}

          {/* Photo navigation areas */}
          {photos.length > 1 && (
            <>
              <button
                onClick={() => handlePhotoNav("prev")}
                className="absolute left-0 top-0 h-full w-1/3 z-10"
                aria-label="Previous photo"
              />
              <button
                onClick={() => handlePhotoNav("next")}
                className="absolute right-0 top-0 h-full w-1/3 z-10"
                aria-label="Next photo"
              />
            </>
          )}

          {/* Photo indicators */}
          {photos.length > 1 && (
            <div className="absolute top-3 left-3 right-3 flex gap-1">
              {photos.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-all duration-200",
                    idx === currentPhoto
                      ? "bg-primary-foreground"
                      : "bg-primary-foreground/40"
                  )}
                />
              ))}
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

          {/* Compatibility badge */}
          {compatibility !== undefined && (
            <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
              {compatibility}% Match
            </div>
          )}

          {/* Info overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-primary-foreground">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-2xl font-bold">{name}</h3>
              <span className="text-xl">{age}</span>
              {verified && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                  ✓
                </span>
              )}
            </div>

            {(occupation || education) && (
              <div className="flex items-center gap-3 text-sm opacity-90 mb-1">
                {occupation && (
                  <span className="flex items-center gap-1">
                    <Briefcase className="h-3.5 w-3.5" />
                    {occupation}
                  </span>
                )}
                {education && (
                  <span className="flex items-center gap-1">
                    <GraduationCap className="h-3.5 w-3.5" />
                    {education}
                  </span>
                )}
              </div>
            )}

            {(location || distance) && (
              <div className="flex items-center gap-1 text-sm opacity-90">
                <MapPin className="h-3.5 w-3.5" />
                {location}
                {distance && <span className="ml-1">• {distance}</span>}
              </div>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="p-4 space-y-3">
          {bio && (
            <p className="text-sm text-muted-foreground line-clamp-2">{bio}</p>
          )}

          {interests.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {interests.slice(0, 5).map((interest, idx) => (
                <Chip key={idx} size="sm" variant="outline">
                  {interest}
                </Chip>
              ))}
              {interests.length > 5 && (
                <Chip size="sm" variant="default">
                  +{interests.length - 5}
                </Chip>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);
ProfileCard.displayName = "ProfileCard";

export { ProfileCard };
