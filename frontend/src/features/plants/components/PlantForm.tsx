import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import type { Plant, PlantFormData } from '../types/PlantTypes';

interface PlantFormProps {
  plant?: Plant | null;
  onSubmit: (data: PlantFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const PlantForm: React.FC<PlantFormProps> = ({
  plant,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) => {
  const [formData, setFormData] = useState<PlantFormData>({
    name: '',
    scientificName: '',
    thumbnail: '',
    tags: [],
    description: '',
    careInstructions: '',
  });
  const [newTag, setNewTag] = useState('');
  const [errors, setErrors] = useState<Partial<PlantFormData>>({});

  useEffect(() => {
    if (plant) {
      setFormData({
        name: plant.name,
        scientificName: plant.scientificName,
        thumbnail: plant.thumbnail,
        tags: [...plant.tags],
        description: plant.description || '',
        careInstructions: plant.careInstructions || '',
      });
    }
  }, [plant]);

  const validateForm = (): boolean => {
    const newErrors: Partial<PlantFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.scientificName.trim()) {
      newErrors.scientificName = 'Scientific name is required';
    }

    if (!formData.thumbnail.trim()) {
      newErrors.thumbnail = 'Thumbnail URL is required';
    } else if (!isValidUrl(formData.thumbnail)) {
      newErrors.thumbnail = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const addTag = () => {
    const tag = newTag.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleInputChange = (field: keyof PlantFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="name" className="text-sm font-medium">
            Plant Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="e.g., Monstera Deliciosa"
            className={errors.name ? 'border-red-500' : ''}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <Label htmlFor="scientificName" className="text-sm font-medium">
            Scientific Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="scientificName"
            value={formData.scientificName}
            onChange={(e) => handleInputChange('scientificName', e.target.value)}
            placeholder="e.g., Monstera deliciosa"
            className={errors.scientificName ? 'border-red-500' : ''}
            disabled={isSubmitting}
          />
          {errors.scientificName && (
            <p className="text-sm text-red-500 mt-1">{errors.scientificName}</p>
          )}
        </div>

        <div>
          <Label htmlFor="thumbnail" className="text-sm font-medium">
            Thumbnail URL <span className="text-red-500">*</span>
          </Label>
          <Input
            id="thumbnail"
            value={formData.thumbnail}
            onChange={(e) => handleInputChange('thumbnail', e.target.value)}
            placeholder="https://example.com/image.jpg"
            className={errors.thumbnail ? 'border-red-500' : ''}
            disabled={isSubmitting}
          />
          {errors.thumbnail && (
            <p className="text-sm text-red-500 mt-1">{errors.thumbnail}</p>
          )}
        </div>

        <div>
          <Label className="text-sm font-medium">Tags</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              disabled={isSubmitting}
            />
            <Button
              type="button"
              onClick={addTag}
              size="sm"
              variant="outline"
              disabled={isSubmitting}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {formData.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                  disabled={isSubmitting}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Brief description of the plant..."
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div>
          <Label htmlFor="careInstructions" className="text-sm font-medium">
            Care Instructions
          </Label>
          <Textarea
            id="careInstructions"
            value={formData.careInstructions}
            onChange={(e) => handleInputChange('careInstructions', e.target.value)}
            placeholder="How to care for this plant..."
            rows={3}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : plant ? 'Update Plant' : 'Add Plant'}
        </Button>
      </div>
    </form>
  );
};