/*
 * AddVehicleModal Component - Add New Vehicle Form
 * Professional modal with responsive form design
 */

import React, { useState } from 'react'
import { X, Car, Calendar, Hash } from 'phosphor-react'
import { Button, Input, Card } from '../ui'

export interface AddVehicleFormData {
  make: string
  model: string
  year: number
  license_plate: string
  current_mileage: number
  status: 'available' | 'maintenance' | 'out_of_service'
  wash_status: boolean
}

interface FormErrors {
  make?: string
  model?: string
  year?: string
  license_plate?: string
  current_mileage?: string
}

interface AddVehicleModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: AddVehicleFormData) => Promise<void>
  isSubmitting?: boolean
}

export const AddVehicleModal: React.FC<AddVehicleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState<AddVehicleFormData>({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    license_plate: '',
    current_mileage: 0,
    status: 'available',
    wash_status: false
  })

  const [errors, setErrors] = useState<FormErrors>({})

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.make.trim()) {
      newErrors.make = 'Make is required'
    }
    if (!formData.model.trim()) {
      newErrors.model = 'Model is required'
    }
    if (formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Please enter a valid year'
    }
    if (!formData.license_plate.trim()) {
      newErrors.license_plate = 'License plate is required'
    }
    if (formData.current_mileage < 0) {
      newErrors.current_mileage = 'Mileage cannot be negative'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
      // Reset form on successful submission
      setFormData({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        license_plate: '',
        current_mileage: 0,
        status: 'available',
        wash_status: false
      })
      setErrors({})
      onClose()
    } catch (error) {
      console.error('Error submitting form:', error)
    }
  }

  const handleInputChange = (field: keyof AddVehicleFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (field in errors && errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Professional backdrop with subtle blur effect */}
        <div 
          className="fixed inset-0 backdrop-blur-sm transition-all duration-300 ease-out opacity-100"
          style={{ 
            backgroundColor: 'rgba(17, 24, 39, 0.25)',
            backdropFilter: 'blur(4px) saturate(1.8)',
            zIndex: 999998
          }}
          onClick={onClose}
        />
        
        {/* Add Vehicle Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200" style={{ zIndex: 999999 }}>
        <Card padding="lg" className="card-responsive">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Car size={24} weight="bold" className="text-blue-600" />
              <h2 className="text-responsive-xl font-bold text-gray-900">Add New Vehicle</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              icon={X}
              iconWeight="bold"
              onClick={onClose}
              className="btn-responsive text-gray-400 hover:text-gray-600"
            />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Vehicle Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-responsive-sm font-medium text-gray-700 mb-2">
                  Make *
                </label>
                <Input
                  icon={Car}
                  iconWeight="regular"
                  placeholder="e.g., BMW, Mercedes, Audi"
                  value={formData.make}
                  onChange={(e) => handleInputChange('make', e.target.value)}
                  fullWidth
                  className="input-responsive"
                  error={errors.make}
                />
              </div>

              <div>
                <label className="block text-responsive-sm font-medium text-gray-700 mb-2">
                  Model *
                </label>
                <Input
                  placeholder="e.g., X5, E-Class, A4"
                  value={formData.model}
                  onChange={(e) => handleInputChange('model', e.target.value)}
                  fullWidth
                  className="input-responsive"
                  error={errors.model}
                />
              </div>

              <div>
                <label className="block text-responsive-sm font-medium text-gray-700 mb-2">
                  Year *
                </label>
                <Input
                  icon={Calendar}
                  iconWeight="regular"
                  type="number"
                  placeholder="2024"
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', parseInt(e.target.value) || new Date().getFullYear())}
                  fullWidth
                  className="input-responsive"
                  error={errors.year}
                />
              </div>

              <div>
                <label className="block text-responsive-sm font-medium text-gray-700 mb-2">
                  License Plate *
                </label>
                <Input
                  icon={Hash}
                  iconWeight="regular"
                  placeholder="e.g., ABC-1234"
                  value={formData.license_plate}
                  onChange={(e) => handleInputChange('license_plate', e.target.value.toUpperCase())}
                  fullWidth
                  className="input-responsive"
                  error={errors.license_plate}
                />
              </div>

              <div>
                <label className="block text-responsive-sm font-medium text-gray-700 mb-2">
                  Initial Mileage
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={formData.current_mileage}
                  onChange={(e) => handleInputChange('current_mileage', parseInt(e.target.value) || 0)}
                  fullWidth
                  className="input-responsive"
                  error={errors.current_mileage}
                />
              </div>

              <div>
                <label className="block text-responsive-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-responsive-base"
                >
                  <option value="available">Available</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="out_of_service">Out of Service</option>
                </select>
              </div>
            </div>

            {/* Wash Status */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="wash_status"
                checked={formData.wash_status}
                onChange={(e) => handleInputChange('wash_status', e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="wash_status" className="text-responsive-sm text-gray-700">
                Vehicle is clean/washed
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
                className="btn-responsive"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="btn-responsive"
              >
                {isSubmitting ? 'Adding...' : 'Add Vehicle'}
              </Button>
            </div>
          </form>
        </Card>
        </div>
      </div>
    </div>
  )
}
