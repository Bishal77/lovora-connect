import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export interface Filters {
  minAge: number;
  maxAge: number;
  maxDistance: number;
  verifiedOnly: boolean;
  preferredGender: string[];
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (filters: Filters) => void;
  currentFilters: Filters;
}

const defaultFilters: Filters = {
  minAge: 18,
  maxAge: 50,
  maxDistance: 50,
  verifiedOnly: false,
  preferredGender: ['male', 'female', 'other']
};

export function DiscoveryFilters({ open, onOpenChange, onApply, currentFilters }: Props) {
  const { user } = useAuth();
  const [filters, setFilters] = useState<Filters>(currentFilters);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFilters(currentFilters);
  }, [currentFilters]);

  const handleAgeChange = (values: number[]) => {
    setFilters(prev => ({
      ...prev,
      minAge: values[0],
      maxAge: values[1]
    }));
  };

  const handleDistanceChange = (values: number[]) => {
    setFilters(prev => ({
      ...prev,
      maxDistance: values[0]
    }));
  };

  const handleGenderToggle = (gender: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      preferredGender: checked 
        ? [...prev.preferredGender, gender]
        : prev.preferredGender.filter(g => g !== gender)
    }));
  };

  const handleApply = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          min_age: filters.minAge,
          max_age: filters.maxAge,
          max_distance_km: filters.maxDistance,
          show_verified_only: filters.verifiedOnly,
          preferred_gender: filters.preferredGender as any
        }, { onConflict: 'user_id' });

      if (error) throw error;

      onApply(filters);
      onOpenChange(false);
      toast.success('Filters saved');
    } catch (error) {
      console.error('Error saving filters:', error);
      toast.error('Failed to save filters');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setFilters(defaultFilters);
  };

  const genderOptions = [
    { value: 'male', label: 'Men' },
    { value: 'female', label: 'Women' },
    { value: 'other', label: 'Non-binary' }
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl">Discovery Filters</SheetTitle>
        </SheetHeader>

        <div className="space-y-8 overflow-y-auto pb-24">
          {/* Age Range */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Age Range</Label>
              <span className="text-sm text-muted-foreground">
                {filters.minAge} - {filters.maxAge} years
              </span>
            </div>
            <Slider
              value={[filters.minAge, filters.maxAge]}
              onValueChange={handleAgeChange}
              min={18}
              max={70}
              step={1}
              className="w-full"
            />
          </div>

          {/* Distance */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Maximum Distance</Label>
              <span className="text-sm text-muted-foreground">
                {filters.maxDistance} km
              </span>
            </div>
            <Slider
              value={[filters.maxDistance]}
              onValueChange={handleDistanceChange}
              min={1}
              max={200}
              step={1}
              className="w-full"
            />
          </div>

          {/* Show Me */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Show Me</Label>
            <div className="space-y-3">
              {genderOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-3">
                  <Checkbox
                    id={option.value}
                    checked={filters.preferredGender.includes(option.value)}
                    onCheckedChange={(checked) => 
                      handleGenderToggle(option.value, checked as boolean)
                    }
                  />
                  <Label htmlFor={option.value} className="font-normal cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Only */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-medium">Verified Profiles Only</Label>
              <p className="text-sm text-muted-foreground">
                Only show profiles with photo verification
              </p>
            </div>
            <Switch
              checked={filters.verifiedOnly}
              onCheckedChange={(checked) => 
                setFilters(prev => ({ ...prev, verifiedOnly: checked }))
              }
            />
          </div>
        </div>

        <SheetFooter className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t">
          <div className="flex gap-3 w-full">
            <Button variant="outline" onClick={handleReset} className="flex-1">
              Reset
            </Button>
            <Button onClick={handleApply} className="flex-1" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Apply Filters
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
