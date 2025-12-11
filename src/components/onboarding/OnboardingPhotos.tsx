import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Camera, X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  photos: string[];
  onUpdate: (photos: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function OnboardingPhotos({ photos, onUpdate, onNext, onBack }: Props) {
  const [error, setError] = useState('');

  const handleAddPhoto = () => {
    // In a real app, this would open a file picker and upload to storage
    // For demo, we'll use placeholder images
    const placeholders = [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop'
    ];
    
    const unusedPhotos = placeholders.filter(p => !photos.includes(p));
    if (unusedPhotos.length > 0 && photos.length < 6) {
      onUpdate([...photos, unusedPhotos[0]]);
    }
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onUpdate(newPhotos);
  };

  const handleNext = () => {
    if (photos.length < 1) {
      setError('Please add at least 1 photo');
      return;
    }
    setError('');
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Add your photos</h2>
        <p className="text-muted-foreground">Add at least 1 photo to continue</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2, 3, 4, 5].map((index) => (
          <div
            key={index}
            className={cn(
              "aspect-[3/4] rounded-xl border-2 border-dashed relative overflow-hidden",
              photos[index] ? "border-transparent" : "border-border bg-muted/50"
            )}
          >
            {photos[index] ? (
              <>
                <img
                  src={photos[index]}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleRemovePhoto(index)}
                  className="absolute top-1 right-1 w-6 h-6 bg-destructive rounded-full flex items-center justify-center"
                >
                  <X className="h-4 w-4 text-destructive-foreground" />
                </button>
                {index === 0 && (
                  <div className="absolute bottom-0 left-0 right-0 bg-primary/90 text-primary-foreground text-xs py-1 text-center">
                    Main photo
                  </div>
                )}
              </>
            ) : (
              <button
                onClick={handleAddPhoto}
                className="w-full h-full flex flex-col items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              >
                {index === 0 ? (
                  <Camera className="h-8 w-8 mb-1" />
                ) : (
                  <Plus className="h-6 w-6" />
                )}
              </button>
            )}
          </div>
        ))}
      </div>

      {error && (
        <p className="text-sm text-destructive text-center">{error}</p>
      )}

      <p className="text-xs text-muted-foreground text-center">
        Tip: Photos where your face is clearly visible get more matches!
      </p>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={handleNext} className="flex-1">
          Continue
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
