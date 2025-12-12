'use client';

import { useState } from 'react';
import { WhiskeyBottle } from '@/types/whiskey';
import {
  WhiskeyCountry,
  WhiskeyType,
  BottleStatus,
  BottleSize,
  WHISKEY_COUNTRIES,
  WHISKEY_TYPES,
  BOTTLE_STATUSES,
  BOTTLE_SIZES,
} from '@/constants/whiskey';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';

interface AddWhiskeyFormProps {
  onAdd: (whiskey: WhiskeyBottle) => Promise<boolean>;
  onClose: () => void;
}

export default function AddWhiskeyForm({ onAdd, onClose }: AddWhiskeyFormProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof WhiskeyBottle, string>>>({});
  const [formData, setFormData] = useState<Partial<WhiskeyBottle>>({
    name: '',
    quantity: 1,
    country: '',
    type: '',
    region: '',
    distillery: '',
    age: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    abv: 0,
    size: BottleSize.ML_750,
    purchasePrice: 0,
    status: BottleStatus.UNOPENED,
    batch: '',
    notes: '',
    currentValue: 0,
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof WhiskeyBottle, string>> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Whiskey name is required';
    }
    if (!formData.distillery?.trim()) {
      newErrors.distillery = 'Distillery is required';
    }
    if (formData.quantity && formData.quantity < 1) {
      newErrors.quantity = 'Quantity must be at least 1';
    }
    if (formData.abv && (formData.abv < 0 || formData.abv > 100)) {
      newErrors.abv = 'ABV must be between 0 and 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const success = await onAdd(formData as WhiskeyBottle);
      if (success) {
        onClose();
      }
    } catch (error) {
      console.error('Error adding whiskey:', error);
      setErrors({ notes: 'Failed to add whiskey. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof WhiskeyBottle, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const countryOptions = WHISKEY_COUNTRIES.map((c) => ({ value: c, label: c }));
  const typeOptions = WHISKEY_TYPES.map((t) => ({ value: t, label: t }));
  const statusOptions = BOTTLE_STATUSES.map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }));
  const sizeOptions = BOTTLE_SIZES.map((s) => ({ value: s, label: s }));

  const footer = (
    <div className="flex justify-end space-x-4">
      <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
        Cancel
      </Button>
      <Button type="submit" variant="primary" isLoading={loading}>
        Add Whiskey
      </Button>
    </div>
  );

  return (
    <Modal isOpen={true} onClose={onClose} title="Add New Whiskey" footer={footer} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div className="md:col-span-2">
            <Input
              label="Whiskey Name *"
              type="text"
              required
              value={formData.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={errors.name}
            />
          </div>

          {/* Distillery */}
          <Input
            label="Distillery *"
            type="text"
            required
            value={formData.distillery || ''}
            onChange={(e) => handleInputChange('distillery', e.target.value)}
            error={errors.distillery}
          />

          {/* Quantity */}
          <Input
            label="Quantity"
            type="number"
            min="1"
            value={formData.quantity || 1}
            onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
            error={errors.quantity}
          />

          {/* Country */}
          <Select
            label="Country"
            value={formData.country || ''}
            onChange={(e) => handleInputChange('country', e.target.value)}
            options={countryOptions}
            placeholder="Select Country"
          />

          {/* Type */}
          <Select
            label="Type"
            value={formData.type || ''}
            onChange={(e) => handleInputChange('type', e.target.value)}
            options={typeOptions}
            placeholder="Select Type"
          />

          {/* Region */}
          <Input
            label="Region"
            type="text"
            value={formData.region || ''}
            onChange={(e) => handleInputChange('region', e.target.value)}
          />

          {/* Age */}
          <Input
            label="Age Statement"
            type="text"
            placeholder="e.g., 12y, NAS, 18yr"
            value={formData.age || ''}
            onChange={(e) => handleInputChange('age', e.target.value)}
          />

          {/* ABV */}
          <Input
            label="ABV (%)"
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={formData.abv || ''}
            onChange={(e) => handleInputChange('abv', parseFloat(e.target.value) || 0)}
            error={errors.abv}
          />

          {/* Size */}
          <Select
            label="Size"
            value={formData.size || BottleSize.ML_750}
            onChange={(e) => handleInputChange('size', e.target.value)}
            options={sizeOptions}
          />

          {/* Purchase Price */}
          <Input
            label="Purchase Price ($)"
            type="number"
            step="0.01"
            min="0"
            value={formData.purchasePrice || ''}
            onChange={(e) => handleInputChange('purchasePrice', parseFloat(e.target.value) || 0)}
          />

          {/* Current Value */}
          <Input
            label="Current Value ($)"
            type="number"
            step="0.01"
            min="0"
            value={formData.currentValue || ''}
            onChange={(e) => handleInputChange('currentValue', parseFloat(e.target.value) || 0)}
          />

          {/* Purchase Date */}
          <Input
            label="Purchase Date"
            type="date"
            value={formData.purchaseDate || ''}
            onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
          />

          {/* Status */}
          <Select
            label="Status"
            value={formData.status || BottleStatus.UNOPENED}
            onChange={(e) => handleInputChange('status', e.target.value)}
            options={statusOptions}
          />

          {/* Batch */}
          <div className="md:col-span-2">
            <Input
              label="Batch/Release Info"
              type="text"
              value={formData.batch || ''}
              onChange={(e) => handleInputChange('batch', e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              rows={3}
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            {errors.notes && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
                {errors.notes}
              </p>
            )}
          </div>
        </div>
      </form>
    </Modal>
  );
}
