/**
 * New Contact Form Component
 * Professional contact creation with business-focused fields and validation
 */

import React, { useState } from 'react'
import { X, User, Phone, Envelope, MapPin } from 'phosphor-react'
import type { Contact } from './types'
import { useContacts } from './ModernContactProvider'
import { designTokens } from './design-tokens'

interface NewContactFormProps {
  isOpen: boolean
  onClose: () => void
}

export function NewContactForm({ isOpen, onClose }: NewContactFormProps) {
  const { addContact } = useContacts()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'client' as 'client' | 'service' | 'employee',
    company: '',
    address: '',
    department: '',
    position: '',
    website: '',
    service_types: [] as string[],
    notes: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!isOpen) return null

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (formData.phone && !/^\+?[\d\s\-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }

    if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) {
      newErrors.website = 'Please enter a valid website URL (e.g., https://example.com)'
    }

    if (formData.type === 'employee' && !formData.department) {
      newErrors.department = 'Department is required for employees'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const newContact: Contact = {
      id: `contact-${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim() || undefined,
      phone: formData.phone.trim() || undefined,
      type: formData.type,
      company: formData.company.trim() || undefined,
      address: formData.address.trim() || undefined,
      website: formData.website.trim() || undefined,
      tags: [],
      location_id: 'test-location-uuid',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      notes: formData.notes.trim() || undefined,
      ...(formData.type === 'employee' && {
        department: formData.department,
        position: formData.position || undefined
      }),
      ...(formData.type === 'service' && {
        service_types: formData.service_types.length > 0 ? formData.service_types : undefined
      })
    }

    addContact(newContact)
    onClose()
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      type: 'client',
      company: '',
      address: '',
      department: '',
      position: '',
      website: '',
      service_types: [],
      notes: ''
    })
    setErrors({})
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ zIndex: designTokens.zIndex.modal + 1 }}
    >
      <div 
        className="absolute inset-0 backdrop-blur-sm transition-all duration-300 ease-out opacity-100"
        style={{ 
          backgroundColor: 'rgba(17, 24, 39, 0.25)',
          backdropFilter: 'blur(4px) saturate(1.8)'
        }}
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New Contact</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close form"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-8rem)]">
          {/* Contact Type */}
          <div>
            <label htmlFor="contact-type" className="block text-sm font-medium text-gray-700 mb-2">Contact Type</label>
            <select
              id="contact-type"
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="client">Client</option>
              <option value="service">Service Provider</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="contact-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter full name"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="contact-company" className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <div className="relative">
                <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="contact-company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Company name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Envelope size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="contact-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="email@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="contact-phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="(555) 123-4567"
                />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>
          </div>

          {/* Address */}
          <div>
            <label htmlFor="contact-address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
              <textarea
                id="contact-address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={2}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Street address, city, state, zip"
              />
            </div>
          </div>

          {/* Type-specific fields */}
          {formData.type === 'employee' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="employee-department" className="block text-sm font-medium text-gray-700 mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  id="employee-department"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.department ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select department</option>
                  <option value="Operations">Operations</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Customer Service">Customer Service</option>
                  <option value="Administration">Administration</option>
                  <option value="Management">Management</option>
                </select>
                {errors.department && <p className="mt-1 text-sm text-red-600">{errors.department}</p>}
              </div>

              <div>
                <label htmlFor="employee-position" className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <input
                  id="employee-position"
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Job title"
                />
              </div>
            </div>
          )}

          {formData.type === 'service' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="service-website" className="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">🌐</span>
                  <input
                    id="service-website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.website ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="https://company-website.com"
                  />
                </div>
                {errors.website && <p className="mt-1 text-sm text-red-600">{errors.website}</p>}
              </div>

              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-2">Service Types</legend>
                <div className="space-y-2">
                  {['Engine Repair', 'Brake Service', 'Oil Change', 'Tire Service', 'Electrical', 'Body Work'].map((service) => (
                    <label key={service} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.service_types.includes(service)}
                        onChange={(e) => {
                          const newServices = e.target.checked
                            ? [...formData.service_types, service]
                            : formData.service_types.filter(s => s !== service)
                          setFormData(prev => ({ ...prev, service_types: newServices }))
                        }}
                        className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{service}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          )}

          {/* Notes */}
          <div>
            <label htmlFor="contact-notes" className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              id="contact-notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Additional information, special instructions, etc."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
