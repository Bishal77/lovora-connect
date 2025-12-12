import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Camera, X, Plus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';

interface Props {
  photos: string[];
  onUpdate: (photos: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function OnboardingPhotos({ photos, onUpdate, onNext, onBack }: Props) {
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadPhoto } = useProfile();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const { url, error } = await uploadPhoto(file, photos.length === 0);
      
      if (error) {
        toast.error('Failed to upload photo');
        console.error(error);
      } else if (url) {
        onUpdate([...photos, url]);
        toast.success('Photo uploaded!');
      }
    } catch (err) {
      toast.error('Failed to upload photo');
      console.error(err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleAddPhoto = () => {
    if (photos.length >= 6) {
      toast.error('Maximum 6 photos allowed');
      return;
    }
    fileInputRef.current?.click();
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

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

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
                disabled={uploading}
                className="w-full h-full flex flex-col items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
              >
                {uploading && index === photos.length ? (
                  <Loader2 className="h-8 w-8 animate-spin" />
                ) : index === 0 ? (
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
        <Button onClick={handleNext} className="flex-1" disabled={uploading}>
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              Continue
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}