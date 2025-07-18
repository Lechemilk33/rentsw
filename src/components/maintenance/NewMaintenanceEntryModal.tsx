/*
 * NewMaintenanceEntryModal - Professional maintenance entry form
 * Comprehensive form for logging maintenance activities
 */

import React, { useState, useEffect, useRef } from 'react'
import { X, Car, Calendar, Wrench, Plus, Trash, User } from 'phosphor-react'
import { Button, Input, Card } from '../ui'
import { useContacts } from '../contact-system/modern-index'
import type { NewMaintenanceEntry } from './types'

interface FormErrors {
  vehicle_id?: string
  mileage?: string
  work_performed?: string
  labor_hours?: string
  cost?: string
}

interface NewMaintenanceEntryModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: NewMaintenanceEntry) => Promise<void>
  isSubmitting?: boolean
  vehicles: Array<{ id: string; make: string; model: string; license_plate: string; current_mileage: number }>
}

export const NewMaintenanceEntryModal: React.FC<NewMaintenanceEntryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  vehicles
}) => {
  const { contacts } = useContacts()
  const technicianDropdownRef = useRef<HTMLDivElement>(null)
  
  const [formData, setFormData] = useState<NewMaintenanceEntry>({
    vehicle_id: '',
    mileage: 0,
    maintenance_type: 'routine',
    work_performed: '',
    parts_used: [],
    labor_hours: 0,
    cost: 0,
    technician: '',
    next_service_due: '',
    next_service_mileage: 0,
    notes: ''
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [newPart, setNewPart] = useState('')
  const [technicianSearch, setTechnicianSearch] = useState('')
  const [showTechnicianDropdown, setShowTechnicianDropdown] = useState(false)
  const [customMaintenanceType, setCustomMaintenanceType] = useState('')
  const [showCustomMaintenanceType, setShowCustomMaintenanceType] = useState(false)
  const [maintenanceTypes, setMaintenanceTypes] = useState([
    'routine',
    'emergency', 
    'preventive',
    'inspection'
  ])

  // Filter contacts for technicians (employees or service providers)
  const availableTechnicians = contacts.filter(contact => 
    contact.type === 'employee' || contact.type === 'service'
  ).filter(contact =>
    contact.name.toLowerCase().includes(technicianSearch.toLowerCase()) ||
    contact.company?.toLowerCase().includes(technicianSearch.toLowerCase())
  )

  // Close technician dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (technicianDropdownRef.current && !technicianDropdownRef.current.contains(event.target as Node)) {
        setShowTechnicianDropdown(false)
      }
    }

    if (showTechnicianDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showTechnicianDropdown])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.vehicle_id) {
      newErrors.vehicle_id = 'Vehicle is required'
    }
    if (formData.mileage <= 0) {
      newErrors.mileage = 'Valid mileage is required'
    }
    if (!formData.work_performed.trim()) {
      newErrors.work_performed = 'Work description is required'
    }
    if (formData.labor_hours < 0) {
      newErrors.labor_hours = 'Labor hours cannot be negative'
    }
    if (formData.cost < 0) {
      newErrors.cost = 'Cost cannot be negative'
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
        vehicle_id: '',
        mileage: 0,
        maintenance_type: 'routine',
        work_performed: '',
        parts_used: [],
        labor_hours: 0,
        cost: 0,
        technician: '',
        next_service_due: '',
        next_service_mileage: 0,
        notes: ''
      })
      setErrors({})
      onClose()
    } catch (error) {
      console.error('Error submitting maintenance entry:', error)
    }
  }

  const handleInputChange = (field: keyof NewMaintenanceEntry, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (field in errors && errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const addPart = () => {
    if (newPart.trim()) {
      setFormData(prev => ({
        ...prev,
        parts_used: [...prev.parts_used, newPart.trim()]
      }))
      setNewPart('')
    }
  }

  const removePart = (index: number) => {
    setFormData(prev => ({
      ...prev,
      parts_used: prev.parts_used.filter((_, i) => i !== index)
    }))
  }

  const handleTechnicianSelect = (technician: { name: string; company?: string }) => {
    const technicianName = technician.company ? `${technician.name} (${technician.company})` : technician.name
    setFormData(prev => ({ ...prev, technician: technicianName }))
    setTechnicianSearch(technicianName)
    setShowTechnicianDropdown(false)
  }

  const handleAddCustomMaintenanceType = () => {
    if (customMaintenanceType.trim() && !maintenanceTypes.includes(customMaintenanceType.trim())) {
      const newType = customMaintenanceType.trim()
      setMaintenanceTypes(prev => [...prev, newType])
      setFormData(prev => ({ ...prev, maintenance_type: newType }))
      setCustomMaintenanceType('')
      setShowCustomMaintenanceType(false)
    }
  }

  const selectedVehicle = vehicles.find(v => v.id === formData.vehicle_id)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-sm transition-all duration-300 ease-out opacity-100"
        style={{ 
          backgroundColor: 'rgba(17, 24, 39, 0.25)',
          backdropFilter: 'blur(4px) saturate(1.8)'
        }}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Main Container */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <Card padding="lg" className="card-responsive">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Wrench size={24} weight="bold" className="text-blue-600" />
              <h2 className="text-responsive-xl font-bold text-gray-900">New Maintenance Entry</h2>
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
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Vehicle Selection */}
              <div>
                <label className="block text-responsive-sm font-medium text-gray-700 mb-2">
                  Vehicle *
                </label>
                <select
                  value={formData.vehicle_id}
                  onChange={(e) => {
                    handleInputChange('vehicle_id', e.target.value)
                    // Auto-populate mileage from vehicle data
                    const vehicle = vehicles.find(v => v.id === e.target.value)
                    if (vehicle) {
                      handleInputChange('mileage', vehicle.current_mileage)
                    }
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-responsive-base"
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.make} {vehicle.model} ({vehicle.license_plate})
                    </option>
                  ))}
                </select>
                {errors.vehicle_id && (
                  <p className="text-red-500 text-responsive-xs mt-1">{errors.vehicle_id}</p>
                )}
              </div>

              {/* Current Mileage */}
              <div>
                <label className="block text-responsive-sm font-medium text-gray-700 mb-2">
                  Current Mileage *
                </label>
                <Input
                  type="number"
                  placeholder="Enter current mileage"
                  value={formData.mileage}
                  onChange={(e) => handleInputChange('mileage', parseInt(e.target.value) || 0)}
                  fullWidth
                  className="input-responsive"
                  error={errors.mileage}
                />
                {selectedVehicle && (
                  <p className="text-responsive-xs text-gray-500 mt-1">
                    Last recorded: {selectedVehicle.current_mileage.toLocaleString()} miles
                  </p>
                )}
              </div>

              {/* Maintenance Type */}
              <div>
                <label htmlFor="maintenance-type" className="block text-responsive-sm font-medium text-gray-700 mb-2">
                  Maintenance Type
                </label>
                <div className="space-y-2">
                  <select
                    id="maintenance-type"
                    value={formData.maintenance_type}
                    onChange={(e) => {
                      if (e.target.value === 'custom') {
                        setShowCustomMaintenanceType(true)
                      } else {
                        handleInputChange('maintenance_type', e.target.value)
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-responsive-base"
                  >
                    {maintenanceTypes.map(type => {
                      const getTypeLabel = (type: string) => {
                        switch (type) {
                          case 'routine': return 'Routine Maintenance'
                          case 'emergency': return 'Emergency Repair'  
                          case 'preventive': return 'Preventive Maintenance'
                          case 'inspection': return 'Inspection'
                          default: return type.charAt(0).toUpperCase() + type.slice(1)
                        }
                      }
                      
                      return (
                        <option key={type} value={type}>
                          {getTypeLabel(type)}
                        </option>
                      )
                    })}
                    <option value="custom">+ Add Custom Type</option>
                  </select>
                  
                  {showCustomMaintenanceType && (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter custom maintenance type"
                        value={customMaintenanceType}
                        onChange={(e) => setCustomMaintenanceType(e.target.value)}
                        fullWidth
                        className="input-responsive"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddCustomMaintenanceType()
                          } else if (e.key === 'Escape') {
                            setCustomMaintenanceType('')
                            setShowCustomMaintenanceType(false)
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddCustomMaintenanceType}
                        className="btn-responsive"
                      >
                        Add
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {
                          setCustomMaintenanceType('')
                          setShowCustomMaintenanceType(false)
                        }}
                        className="btn-responsive"
                      >
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Technician */}
              <div className="relative" ref={technicianDropdownRef}>
                <label htmlFor="technician" className="block text-responsive-sm font-medium text-gray-700 mb-2">
                  Technician
                </label>
                <div className="relative">
                  <Input
                    id="technician"
                    placeholder="Search technicians or enter name (optional)"
                    value={technicianSearch}
                    onChange={(e) => {
                      setTechnicianSearch(e.target.value)
                      handleInputChange('technician', e.target.value)
                      setShowTechnicianDropdown(true)
                    }}
                    onFocus={() => setShowTechnicianDropdown(true)}
                    fullWidth
                    className="input-responsive"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <User size={16} className="text-gray-400" />
                  </div>
                </div>
                
                {/* Technician Dropdown */}
                {showTechnicianDropdown && availableTechnicians.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {availableTechnicians.map((contact) => (
                      <button
                        key={contact.id}
                        type="button"
                        onClick={() => handleTechnicianSelect(contact)}
                        className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{contact.name}</div>
                          {contact.company && (
                            <div className="text-sm text-gray-500">{contact.company}</div>
                          )}
                          <div className="text-xs text-gray-400 capitalize">{contact.type}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Work Performed */}
            <div>
              <label htmlFor="work-performed" className="block text-responsive-sm font-medium text-gray-700 mb-2">
                Work Performed *
              </label>
              <textarea
                id="work-performed"
                rows={4}
                placeholder="Describe the maintenance work performed..."
                value={formData.work_performed}
                onChange={(e) => handleInputChange('work_performed', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-responsive-base"
              />
              {errors.work_performed && (
                <p className="text-red-500 text-responsive-xs mt-1">{errors.work_performed}</p>
              )}
            </div>

            {/* Parts Used */}
            <div>
              <label htmlFor="parts-list" className="block text-responsive-sm font-medium text-gray-700 mb-2">
                Parts Used
              </label>
              <div className="space-y-3">
                {/* Add Part Input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter part name/number"
                    value={newPart}
                    onChange={(e) => setNewPart(e.target.value)}
                    fullWidth
                    className="input-responsive"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addPart()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    icon={Plus}
                    iconWeight="bold"
                    onClick={addPart}
                    className="btn-responsive"
                  >
                    Add
                  </Button>
                </div>

                {/* Parts List */}
                {formData.parts_used.length > 0 && (
                  <div id="parts-list" className="space-y-2">
                    {formData.parts_used.map((part, index) => (
                      <div key={part + index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                        <span className="text-responsive-sm text-gray-900">{part}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          icon={Trash}
                          iconWeight="regular"
                          onClick={() => removePart(index)}
                          className="text-red-500 hover:text-red-700"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cost & Labor */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="labor-hours" className="block text-responsive-sm font-medium text-gray-700 mb-2">
                  Labor Hours
                </label>
                <Input
                  id="labor-hours"
                  type="number"
                  step="0.5"
                  placeholder="0"
                  value={formData.labor_hours}
                  onChange={(e) => handleInputChange('labor_hours', parseFloat(e.target.value) || 0)}
                  fullWidth
                  className="input-responsive"
                  error={errors.labor_hours}
                />
              </div>

              <div>
                <label htmlFor="total-cost" className="block text-responsive-sm font-medium text-gray-700 mb-2">
                  Total Cost
                </label>
                <Input
                  id="total-cost"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.cost}
                  onChange={(e) => handleInputChange('cost', parseFloat(e.target.value) || 0)}
                  fullWidth
                  className="input-responsive"
                  error={errors.cost}
                />
              </div>
            </div>

            {/* Next Service */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="next-service-date" className="block text-responsive-sm font-medium text-gray-700 mb-2">
                  Next Service Due Date
                </label>
                <Input
                  id="next-service-date"
                  type="date"
                  value={formData.next_service_due}
                  onChange={(e) => handleInputChange('next_service_due', e.target.value)}
                  fullWidth
                  className="input-responsive"
                />
              </div>

              <div>
                <label htmlFor="next-service-mileage" className="block text-responsive-sm font-medium text-gray-700 mb-2">
                  Next Service Mileage
                </label>
                <Input
                  id="next-service-mileage"
                  type="number"
                  placeholder="Next service at mileage"
                  value={formData.next_service_mileage}
                  onChange={(e) => handleInputChange('next_service_mileage', parseInt(e.target.value) || 0)}
                  fullWidth
                  className="input-responsive"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-responsive-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                id="notes"
                rows={3}
                placeholder="Any additional notes or observations..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-responsive-base"
              />
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
                {isSubmitting ? 'Saving Entry...' : 'Save Entry'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
