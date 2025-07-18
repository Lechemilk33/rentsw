/*
 * Add Vehicle Overlay Component
 * Professional vehicle addition interface for RENTAGAIN fleet management
 * Features: Form validation, enterprise design, seamless integration
 */

import React, { useState } from 'react'
import { 
  X,
  Car,
  Plus,
  FloppyDisk
} from 'phosphor-react'
import { Button, Card } from '../ui'
import type { Vehicle } from './EnterpriseVehicleTable'

interface AddVehicleOverlayProps {
  isOpen: boolean
  onClose: () => void
  onSave: (vehicleData: Omit<Vehicle, 'id'>) => void
}

export function AddVehicleOverlay({ 
  isOpen, 
  onClose, 
  onSave 
}: Readonly<AddVehicleOverlayProps>) {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    license_plate: '',
    status: 'available' as Vehicle['status'],
    location: 'Tracking Location...', // Will be populated by tracking API
    vin: '',
    mileage: 0,
    is_clean: true,
    last_service_date: new Date().toISOString().split('T')[0]
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  if (!isOpen) return null

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.make.trim()) newErrors.make = 'Make is required'
    if (!formData.model.trim()) newErrors.model = 'Model is required'
    if (formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      newErrors.year = 'Please enter a valid year'
    }
    if (formData.mileage < 0) newErrors.mileage = 'Mileage cannot be negative'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onSave(formData)
      
      // Reset form
      setFormData({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        license_plate: '',
        status: 'available',
        location: 'Tracking Location...', // Will be populated by tracking API
        vin: '',
        mileage: 0,
        is_clean: true,
        last_service_date: new Date().toISOString().split('T')[0]
      })
      setErrors({})
      onClose()
    } catch (error) {
      console.error('Failed to add vehicle:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Professional backdrop */}
        <button
          className="fixed inset-0 backdrop-blur-sm transition-all duration-300 ease-out opacity-100"
          style={{ 
            backgroundColor: 'rgba(17, 24, 39, 0.25)',
            backdropFilter: 'blur(4px) saturate(1.8)',
            zIndex: 999998
          }}
          onClick={onClose}
          onKeyDown={(e) => e.key === 'Escape' && onClose()}
          aria-label="Close add vehicle form"
        />
        
        {/* Add Vehicle Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[95vh] overflow-hidden border border-gray-200" style={{ zIndex: 999999 }}>
          {/* Header */}
          <div className="relative bg-white px-6 py-5 border-b border-gray-100">
            {/* Close button */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Title */}
            <div className="pr-16">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-200">
                  <Plus size={24} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Add New Vehicle</h2>
                  <p className="text-sm text-gray-500">Enter vehicle details to add to your fleet. Location will be tracked automatically.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(95vh-12rem)]">
            <div className="p-6 space-y-6">
              
              {/* Vehicle Information */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Car size={20} className="text-blue-600" />
                  <span>Vehicle Information</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Make */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Make *
                    </label>
                    <input
                      type="text"
                      value={formData.make}
                      onChange={(e) => handleInputChange('make', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.make ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Toyota, Honda, Ford"
                    />
                    {errors.make && <p className="text-red-500 text-sm mt-1">{errors.make}</p>}
                  </div>

                  {/* Model */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Model *
                    </label>
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) => handleInputChange('model', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.model ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., Camry, Accord, Explorer"
                    />
                    {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
                  </div>

                  {/* Year */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year *
                    </label>
                    <input
                      type="number"
                      value={formData.year}
                      onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.year ? 'border-red-300' : 'border-gray-300'
                      }`}
                      min="1900"
                      max={new Date().getFullYear() + 1}
                    />
                    {errors.year && <p className="text-red-500 text-sm mt-1">{errors.year}</p>}
                  </div>

                  {/* License Plate */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      License Plate
                    </label>
                    <input
                      type="text"
                      value={formData.license_plate}
                      onChange={(e) => handleInputChange('license_plate', e.target.value.toUpperCase())}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.license_plate ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., ABC-123 (optional)"
                    />
                    {errors.license_plate && <p className="text-red-500 text-sm mt-1">{errors.license_plate}</p>}
                  </div>

                  {/* VIN */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      VIN (Vehicle Identification Number)
                    </label>
                    <input
                      type="text"
                      value={formData.vin}
                      onChange={(e) => handleInputChange('vin', e.target.value.toUpperCase())}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.vin ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="17-character VIN (optional)"
                      maxLength={17}
                    />
                    {errors.vin && <p className="text-red-500 text-sm mt-1">{errors.vin}</p>}
                  </div>
                </div>
              </Card>

              {/* Status and Details */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Status & Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="available">Available</option>
                      <option value="rented">Rented</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="out_of_service">Out of Service</option>
                    </select>
                  </div>

                  {/* Mileage */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mileage
                    </label>
                    <input
                      type="number"
                      value={formData.mileage}
                      onChange={(e) => handleInputChange('mileage', parseInt(e.target.value) || 0)}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.mileage ? 'border-red-300' : 'border-gray-300'
                      }`}
                      min="0"
                      placeholder="Current mileage"
                    />
                    {errors.mileage && <p className="text-red-500 text-sm mt-1">{errors.mileage}</p>}
                  </div>

                  {/* Last Service Date */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Service Date
                    </label>
                    <input
                      type="date"
                      value={formData.last_service_date}
                      onChange={(e) => handleInputChange('last_service_date', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Condition Toggle */}
                <div className="mt-4">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.is_clean}
                      onChange={(e) => handleInputChange('is_clean', e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Vehicle is clean and ready for rental</span>
                  </label>
                </div>
              </Card>

            </div>

            {/* Action Buttons */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                  className="flex items-center justify-center space-x-2 py-3"
                >
                  <span>Cancel</span>
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center justify-center space-x-2 py-3 px-6 sm:ml-auto"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Adding Vehicle...</span>
                    </>
                  ) : (
                    <>
                      <FloppyDisk size={18} />
                      <span>Add Vehicle</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddVehicleOverlay
