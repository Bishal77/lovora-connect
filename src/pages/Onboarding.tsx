import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { OnboardingBasicInfo } from '@/components/onboarding/OnboardingBasicInfo';
import { OnboardingPhotos } from '@/components/onboarding/OnboardingPhotos';
import { OnboardingInterests } from '@/components/onboarding/OnboardingInterests';
import { OnboardingBio } from '@/components/onboarding/OnboardingBio';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

type GenderType = 'male' | 'female' | 'other' | 'prefer_not_to_say';
type RelationshipGoal = 'casual' | 'serious' | 'marriage' | 'friendship';

function OnboardingContent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, interests, updateProfile, toggleInterest } = useProfile();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const [basicInfo, setBasicInfo] = useState<{
    full_name: string;
    date_of_birth: string;
    gender: GenderType;
  }>({
    full_name: '',
    date_of_birth: '',
    gender: 'prefer_not_to_say'
  });

  const [photos, setPhotos] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [bioData, setBioData] = useState<{
    bio: string;
    city: string;
    occupation: string;
    relationship_goal: RelationshipGoal;
  }>({
    bio: '',
    city: '',
    occupation: '',
    relationship_goal: 'casual'
  });

  useEffect(() => {
    if (profile) {
      setBasicInfo({
        full_name: profile.full_name || '',
        date_of_birth: profile.date_of_birth || '',
        gender: (profile.gender as GenderType) || 'prefer_not_to_say'
      });
    }
  }, [profile]);

  const handleFinish = async () => {
    const updates = {
      ...basicInfo,
      ...bioData,
      onboarding_completed: true
    };

    const { error } = await updateProfile(updates);
    if (error) {
      toast.error('Failed to save profile');
      return;
    }

    toast.success('Profile created successfully!');
    navigate('/home');
  };

  const handleToggleInterest = (interestId: string) => {
    setSelectedInterests(prev => 
      prev.includes(interestId) 
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
    toggleInterest(interestId);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="p-4">
        <Progress value={(step / totalSteps) * 100} className="h-1" />
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Step {step} of {totalSteps}
        </p>
      </div>

      <div className="flex-1 p-6">
        {step === 1 && (
          <OnboardingBasicInfo
            data={basicInfo}
            onUpdate={(data) => setBasicInfo(prev => ({ ...prev, ...data }))}
            onNext={() => setStep(2)}
          />
        )}
        {step === 2 && (
          <OnboardingPhotos
            photos={photos}
            onUpdate={setPhotos}
            onNext={() => setStep(3)}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <OnboardingInterests
            interests={interests}
            selectedInterests={selectedInterests}
            onToggle={handleToggleInterest}
            onNext={() => setStep(4)}
            onBack={() => setStep(2)}
          />
        )}
        {step === 4 && (
          <OnboardingBio
            data={bioData}
            onUpdate={(data) => setBioData(prev => ({ ...prev, ...data }))}
            onNext={handleFinish}
            onBack={() => setStep(3)}
          />
        )}
      </div>
    </div>
  );
}

export default function Onboarding() {
  return <OnboardingContent />;
}
