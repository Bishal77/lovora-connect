import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronRight } from 'lucide-react';

interface BasicInfoData {
  full_name: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say';
}

interface Props {
  data: BasicInfoData;
  onUpdate: (data: Partial<BasicInfoData>) => void;
  onNext: () => void;
}

export function OnboardingBasicInfo({ data, onUpdate, onNext }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!data.full_name.trim()) {
      newErrors.full_name = 'Please enter your name';
    }
    
    if (!data.date_of_birth) {
      newErrors.date_of_birth = 'Please enter your date of birth';
    } else {
      const age = new Date().getFullYear() - new Date(data.date_of_birth).getFullYear();
      if (age < 18) {
        newErrors.date_of_birth = 'You must be at least 18 years old';
      }
    }
    
    if (!data.gender) {
      newErrors.gender = 'Please select your gender';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext();
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Let's get started</h2>
        <p className="text-muted-foreground">Tell us about yourself</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Your name</Label>
          <Input
            id="full_name"
            placeholder="Enter your full name"
            value={data.full_name}
            onChange={(e) => onUpdate({ full_name: e.target.value })}
            className={errors.full_name ? 'border-destructive' : ''}
          />
          {errors.full_name && (
            <p className="text-sm text-destructive">{errors.full_name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="date_of_birth">Date of birth</Label>
          <Input
            id="date_of_birth"
            type="date"
            value={data.date_of_birth}
            onChange={(e) => onUpdate({ date_of_birth: e.target.value })}
            className={errors.date_of_birth ? 'border-destructive' : ''}
          />
          {errors.date_of_birth && (
            <p className="text-sm text-destructive">{errors.date_of_birth}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>I am a</Label>
          <Select value={data.gender} onValueChange={(value: any) => onUpdate({ gender: value })}>
            <SelectTrigger className={errors.gender ? 'border-destructive' : ''}>
              <SelectValue placeholder="Select your gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Man</SelectItem>
              <SelectItem value="female">Woman</SelectItem>
              <SelectItem value="other">Non-binary</SelectItem>
              <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && (
            <p className="text-sm text-destructive">{errors.gender}</p>
          )}
        </div>
      </div>

      <Button onClick={handleNext} className="w-full" size="lg">
        Continue
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </div>
  );
}
