import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { toast } from 'sonner';
import { Camera, RefreshCw, Check, X, Loader2 } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

const VERIFICATION_POSES = [
  { id: 'thumbs_up', instruction: 'Give a thumbs up 👍', emoji: '👍' },
  { id: 'peace', instruction: 'Show a peace sign ✌️', emoji: '✌️' },
  { id: 'wave', instruction: 'Wave at the camera 👋', emoji: '👋' },
  { id: 'smile', instruction: 'Give us a big smile 😄', emoji: '😄' },
  { id: 'point', instruction: 'Point to the camera 👉', emoji: '👉' },
];

export function PhotoVerification({ open, onOpenChange, onComplete }: Props) {
  const { user } = useAuth();
  const { updateProfile } = useProfile();
  const [step, setStep] = useState<'intro' | 'capture' | 'review' | 'submitting' | 'complete'>('intro');
  const [pose, setPose] = useState(VERIFICATION_POSES[0]);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const selectRandomPose = useCallback(() => {
    const randomPose = VERIFICATION_POSES[Math.floor(Math.random() * VERIFICATION_POSES.length)];
    setPose(randomPose);
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 }
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      selectRandomPose();
      setStep('capture');
    } catch (error) {
      toast.error('Could not access camera. Please allow camera permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageData);
    setStep('review');
    stopCamera();
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  const submitVerification = async () => {
    if (!user || !capturedImage) return;

    setStep('submitting');

    try {
      // Convert base64 to blob
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const file = new File([blob], `verification_${Date.now()}.jpg`, { type: 'image/jpeg' });

      // Upload to storage
      const fileName = `${user.id}/verification_${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Update profile verification status to pending
      const { error: updateError } = await updateProfile({
        verification_status: 'pending'
      });

      if (updateError) throw updateError;

      setStep('complete');
      toast.success('Verification photo submitted!');
      
      setTimeout(() => {
        onOpenChange(false);
        onComplete?.();
        // Reset state
        setStep('intro');
        setCapturedImage(null);
      }, 2000);

    } catch (error) {
      console.error('Verification error:', error);
      toast.error('Failed to submit verification. Please try again.');
      setStep('review');
    }
  };

  const handleClose = () => {
    stopCamera();
    onOpenChange(false);
    setStep('intro');
    setCapturedImage(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            {step === 'intro' && 'Verify Your Profile'}
            {step === 'capture' && 'Take Your Photo'}
            {step === 'review' && 'Review Your Photo'}
            {step === 'submitting' && 'Submitting...'}
            {step === 'complete' && 'Verification Submitted!'}
          </DialogTitle>
          <DialogDescription className="text-center">
            {step === 'intro' && 'Get a verified badge by taking a quick selfie'}
            {step === 'capture' && pose.instruction}
            {step === 'review' && 'Make sure your face is clearly visible'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center py-4">
          <AnimatePresence mode="wait">
            {step === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center space-y-6"
              >
                <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                  <Camera className="w-12 h-12 text-primary" />
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    We'll ask you to make a specific pose to prove you're real.
                    This helps keep our community safe!
                  </p>
                </div>

                <div className="bg-muted rounded-lg p-4 text-left space-y-2">
                  <p className="text-sm font-medium">What happens next:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• You'll see a random pose to copy</li>
                    <li>• Take a selfie matching the pose</li>
                    <li>• Our team reviews and verifies</li>
                  </ul>
                </div>

                <Button onClick={startCamera} className="w-full">
                  <Camera className="w-4 h-4 mr-2" />
                  Start Verification
                </Button>
              </motion.div>
            )}

            {step === 'capture' && (
              <motion.div
                key="capture"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full space-y-4"
              >
                <div className="relative aspect-[4/3] bg-black rounded-2xl overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform scale-x-[-1]"
                  />
                  
                  {/* Pose indicator */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-2xl">{pose.emoji}</span>
                  </div>
                </div>

                <canvas ref={canvasRef} className="hidden" />

                <div className="flex gap-3">
                  <Button variant="outline" onClick={selectRandomPose} className="flex-1">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    New Pose
                  </Button>
                  <Button onClick={capturePhoto} className="flex-1">
                    <Camera className="w-4 h-4 mr-2" />
                    Capture
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 'review' && capturedImage && (
              <motion.div
                key="review"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full space-y-4"
              >
                <div className="relative aspect-[4/3] bg-black rounded-2xl overflow-hidden">
                  <img
                    src={capturedImage}
                    alt="Captured verification"
                    className="w-full h-full object-cover transform scale-x-[-1]"
                  />
                  
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full">
                    <span className="text-lg font-medium">Pose: {pose.emoji}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={retakePhoto} className="flex-1">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Retake
                  </Button>
                  <Button onClick={submitVerification} className="flex-1">
                    <Check className="w-4 h-4 mr-2" />
                    Submit
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 'submitting' && (
              <motion.div
                key="submitting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">Uploading your photo...</p>
              </motion.div>
            )}

            {step === 'complete' && (
              <motion.div
                key="complete"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center py-8"
              >
                <div className="w-16 h-16 mx-auto bg-success/20 rounded-full flex items-center justify-center mb-4">
                  <Check className="w-8 h-8 text-success" />
                </div>
                <p className="font-medium">Verification Submitted!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  We'll review your photo and update your status soon.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
