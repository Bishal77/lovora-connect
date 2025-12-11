import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronRight } from 'lucide-react';

interface BioData {
  bio: string;
  city: string;
  occupation: string;
  relationship_goal: 'casual' | 'serious' | 'marriage' | 'friendship';
}

interface Props {
  data: BioData;
  onUpdate: (data: Partial<BioData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function OnboardingBio({ data, onUpdate, onNext, onBack }: Props) {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">Tell us more</h2>
        <p className="text-muted-foreground">Help others get to know you</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bio">About me</Label>
          <Textarea
            id="bio"
            placeholder="Write something interesting about yourself..."
            value={data.bio}
            onChange={(e) => onUpdate({ bio: e.target.value })}
            className="min-h-[100px] resize-none"
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground text-right">
            {data.bio.length}/500
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="Where do you live?"
            value={data.city}
            onChange={(e) => onUpdate({ city: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="occupation">Occupation</Label>
          <Input
            id="occupation"
            placeholder="What do you do?"
            value={data.occupation}
            onChange={(e) => onUpdate({ occupation: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label>Looking for</Label>
          <Select 
            value={data.relationship_goal} 
            onValueChange={(value: any) => onUpdate({ relationship_goal: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="What are you looking for?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="casual">Something casual</SelectItem>
              <SelectItem value="serious">A serious relationship</SelectItem>
              <SelectItem value="marriage">Marriage</SelectItem>
              <SelectItem value="friendship">New friends</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={onNext} className="flex-1">
          Finish
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
