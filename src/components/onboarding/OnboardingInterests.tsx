import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Chip } from '@/components/ui/chip';
import { Interest } from '@/hooks/useProfile';
import { cn } from '@/lib/utils';

interface Props {
  interests: Interest[];
  selectedInterests: string[];
  onToggle: (interestId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function OnboardingInterests({ interests, selectedInterests, onToggle, onNext, onBack }: Props) {
  const handleNext = () => {
    onNext();
  };

  // Group interests by category
  const grouped = interests.reduce((acc, interest) => {
    const category = interest.category || 'Other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(interest);
    return acc;
  }, {} as Record<string, Interest[]>);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-foreground">What are your interests?</h2>
        <p className="text-muted-foreground">Select a few things you enjoy</p>
      </div>

      <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
        {Object.entries(grouped).map(([category, categoryInterests]) => (
          <div key={category} className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground capitalize">{category}</h3>
            <div className="flex flex-wrap gap-2">
              {categoryInterests.map((interest) => {
                const isSelected = selectedInterests.includes(interest.id);
                return (
                  <button
                    key={interest.id}
                    onClick={() => onToggle(interest.id)}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all",
                      isSelected
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                  >
                    {interest.icon} {interest.name}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        {selectedInterests.length} interests selected
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
