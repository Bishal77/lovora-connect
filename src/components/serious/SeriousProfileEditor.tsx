import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SeriousProfile } from '@/hooks/useSeriousMode';
import { Loader2 } from 'lucide-react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: SeriousProfile | null;
  onSave: (updates: Partial<SeriousProfile>) => Promise<{ error: Error | null }>;
}

const RELIGIONS = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Buddhist', 'Jain', 'Other', 'Prefer not to say'];
const FAMILY_TYPES = ['Joint', 'Nuclear', 'Extended'];
const SALARY_RANGES = ['Below 5 LPA', '5-10 LPA', '10-20 LPA', '20-50 LPA', '50+ LPA', 'Prefer not to say'];
const EDUCATION_LEVELS = ['high_school', 'bachelors', 'masters', 'doctorate'];

export function SeriousProfileEditor({ open, onOpenChange, profile, onSave }: Props) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<SeriousProfile>>(profile || {});

  const handleSave = async () => {
    setSaving(true);
    const { error } = await onSave(formData);
    setSaving(false);
    if (!error) {
      onOpenChange(false);
    }
  };

  const updateField = (field: keyof SeriousProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl overflow-hidden">
        <SheetHeader className="mb-4">
          <SheetTitle className="text-2xl">Serious Mode Profile</SheetTitle>
        </SheetHeader>

        <div className="overflow-y-auto h-[calc(100%-140px)] space-y-6 pb-4">
          {/* Religion & Community */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Religion & Community</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Religion</Label>
                <Select
                  value={formData.religion || ''}
                  onValueChange={(v) => updateField('religion', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select religion" />
                  </SelectTrigger>
                  <SelectContent>
                    {RELIGIONS.map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Caste/Community</Label>
                <Input
                  value={formData.caste || ''}
                  onChange={(e) => updateField('caste', e.target.value)}
                  placeholder="e.g., Brahmin"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Mother Tongue</Label>
              <Input
                value={formData.mother_tongue || ''}
                onChange={(e) => updateField('mother_tongue', e.target.value)}
                placeholder="e.g., Hindi, Tamil"
              />
            </div>
          </div>

          {/* Family Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Family Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Family Type</Label>
                <Select
                  value={formData.family_type || ''}
                  onValueChange={(v) => updateField('family_type', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {FAMILY_TYPES.map(t => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Number of Siblings</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.siblings ?? ''}
                  onChange={(e) => updateField('siblings', parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Father's Occupation</Label>
                <Input
                  value={formData.father_occupation || ''}
                  onChange={(e) => updateField('father_occupation', e.target.value)}
                  placeholder="e.g., Business"
                />
              </div>

              <div className="space-y-2">
                <Label>Mother's Occupation</Label>
                <Input
                  value={formData.mother_occupation || ''}
                  onChange={(e) => updateField('mother_occupation', e.target.value)}
                  placeholder="e.g., Homemaker"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Family Values</Label>
              <Select
                value={formData.family_values || ''}
                onValueChange={(v) => updateField('family_values', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select values" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Traditional">Traditional</SelectItem>
                  <SelectItem value="Moderate">Moderate</SelectItem>
                  <SelectItem value="Liberal">Liberal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>About Family</Label>
              <Textarea
                value={formData.about_family || ''}
                onChange={(e) => updateField('about_family', e.target.value)}
                placeholder="Tell us about your family..."
                rows={3}
              />
            </div>
          </div>

          {/* Financial Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Financial Details</h3>
            
            <div className="space-y-2">
              <Label>Annual Income</Label>
              <Select
                value={formData.salary_range || ''}
                onValueChange={(v) => updateField('salary_range', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  {SALARY_RANGES.map(r => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Assets (Optional)</Label>
              <Input
                value={formData.assets || ''}
                onChange={(e) => updateField('assets', e.target.value)}
                placeholder="e.g., Own house, Car"
              />
            </div>
          </div>

          {/* Partner Preferences */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Partner Preferences</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Label>Age Range</Label>
                  <span className="text-sm text-muted-foreground">
                    {formData.partner_age_min || 21} - {formData.partner_age_max || 35} years
                  </span>
                </div>
                <Slider
                  value={[formData.partner_age_min || 21, formData.partner_age_max || 35]}
                  onValueChange={([min, max]) => {
                    updateField('partner_age_min', min);
                    updateField('partner_age_max', max);
                  }}
                  min={18}
                  max={60}
                  step={1}
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label>Height Range</Label>
                  <span className="text-sm text-muted-foreground">
                    {formData.partner_height_min || 150} - {formData.partner_height_max || 190} cm
                  </span>
                </div>
                <Slider
                  value={[formData.partner_height_min || 150, formData.partner_height_max || 190]}
                  onValueChange={([min, max]) => {
                    updateField('partner_height_min', min);
                    updateField('partner_height_max', max);
                  }}
                  min={120}
                  max={220}
                  step={1}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Your Expectations</Label>
              <Textarea
                value={formData.expectations || ''}
                onChange={(e) => updateField('expectations', e.target.value)}
                placeholder="Describe what you're looking for in a partner..."
                rows={4}
              />
            </div>
          </div>
        </div>

        <SheetFooter className="absolute bottom-0 left-0 right-0 p-6 bg-background border-t">
          <Button onClick={handleSave} className="w-full" disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Profile
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
