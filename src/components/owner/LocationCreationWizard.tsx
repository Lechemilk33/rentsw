import { useState } from 'react';
import { X, MapPin, User, Check, Buildings } from "phosphor-react";

interface LocationCreationWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (locationData: any) => void;
}

export default function LocationCreationWizard({ isOpen, onClose, onSubmit }: LocationCreationWizardProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Location Details
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    
    // Contact Information
    adminName: '',
    adminEmail: '',
    adminPhone: '',
    
    // Business Details
    operatingHours: {
      monday: { open: '08:00', close: '18:00', closed: false },
      tuesday: { open: '08:00', close: '18:00', closed: false },
      wednesday: { open: '08:00', close: '18:00', closed: false },
      thursday: { open: '08:00', close: '18:00', closed: false },
      friday: { open: '08:00', close: '18:00', closed: false },
      saturday: { open: '09:00', close: '17:00', closed: false },
      sunday: { open: '10:00', close: '16:00', closed: false }
    },
    initialFleetSize: 5,
    locationTypes: []
  });

  const steps = [
    { id: 1, name: 'Location Details', description: 'Basic location information' },
    { id: 2, name: 'Contact Information', description: 'Admin and contact details' },
    { id: 3, name: 'Business Setup', description: 'Hours and operational details' },
    { id: 4, name: 'Review & Submit', description: 'Confirm your details' }
  ];

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Add New Location</h2>
            <p className="text-sm text-gray-600 mt-1">Step {step} of {steps.length}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {steps.map((stepItem, index) => (
              <div key={stepItem.id} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step >= stepItem.id ? 'bg-amber-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step > stepItem.id ? <Check size={16} /> : stepItem.id}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${step >= stepItem.id ? 'text-gray-900' : 'text-gray-500'}`}>
                    {stepItem.name}
                  </p>
                  <p className="text-xs text-gray-500">{stepItem.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-px mx-4 ${step > stepItem.id ? 'bg-amber-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {step === 1 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-amber-600 mb-4">
                <MapPin size={20} />
                <h3 className="text-lg font-semibold">Location Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="location-name" className="block text-sm font-medium text-gray-700 mb-2">Location Name</label>
                  <input
                    id="location-name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Downtown Hub"
                  />
                </div>
                
                <div>
                  <label htmlFor="street-address" className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                  <input
                    id="street-address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => updateFormData('address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="123 Main Street"
                  />
                </div>
                
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    id="city"
                    type="text"
                    value={formData.city}
                    onChange={(e) => updateFormData('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="Seattle"
                  />
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <select
                    id="state"
                    value={formData.state}
                    onChange={(e) => updateFormData('state', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="">Select State</option>
                    <option value="WA">Washington</option>
                    <option value="CA">California</option>
                    <option value="OR">Oregon</option>
                    <option value="NY">New York</option>
                    <option value="TX">Texas</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="zip-code" className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                  <input
                    id="zip-code"
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => updateFormData('zipCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="98101"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-amber-600 mb-4">
                <User size={20} />
                <h3 className="text-lg font-semibold">Contact Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="admin-name" className="block text-sm font-medium text-gray-700 mb-2">Location Admin Name</label>
                  <input
                    id="admin-name"
                    type="text"
                    value={formData.adminName}
                    onChange={(e) => updateFormData('adminName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="John Smith"
                  />
                </div>
                
                <div>
                  <label htmlFor="admin-email" className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
                  <input
                    id="admin-email"
                    type="email"
                    value={formData.adminEmail}
                    onChange={(e) => updateFormData('adminEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="john.smith@company.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="admin-phone" className="block text-sm font-medium text-gray-700 mb-2">Admin Phone</label>
                  <input
                    id="admin-phone"
                    type="tel"
                    value={formData.adminPhone}
                    onChange={(e) => updateFormData('adminPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-amber-600 mb-4">
                <Buildings size={20} />
                <h3 className="text-lg font-semibold">Business Setup</h3>
              </div>
              
              <div>
                <label htmlFor="fleet-size" className="block text-sm font-medium text-gray-700 mb-2">Initial Fleet Size</label>
                <input
                  id="fleet-size"
                  type="number"
                  value={formData.initialFleetSize}
                  onChange={(e) => updateFormData('initialFleetSize', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder="5"
                  min="1"
                  max="100"
                />
              </div>

              <div>
                <div className="block text-sm font-medium text-gray-700 mb-4">Operating Hours</div>
                <div className="space-y-3">
                  {Object.entries(formData.operatingHours).map(([day, hours]) => (
                    <div key={day} className="flex items-center space-x-4">
                      <div className="w-24">
                        <span className="text-sm font-medium text-gray-700 capitalize">{day}</span>
                      </div>
                      <input
                        type="time"
                        value={hours.open}
                        onChange={(e) => updateFormData('operatingHours', {
                          ...formData.operatingHours,
                          [day]: { ...hours, open: e.target.value }
                        })}
                        disabled={hours.closed}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-100"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) => updateFormData('operatingHours', {
                          ...formData.operatingHours,
                          [day]: { ...hours, close: e.target.value }
                        })}
                        disabled={hours.closed}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 disabled:bg-gray-100"
                      />
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={hours.closed}
                          onChange={(e) => updateFormData('operatingHours', {
                            ...formData.operatingHours,
                            [day]: { ...hours, closed: e.target.checked }
                          })}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-600">Closed</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="flex items-center space-x-2 text-amber-600 mb-4">
                <Check size={20} />
                <h3 className="text-lg font-semibold">Review & Submit</h3>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Location Details</h4>
                  <p className="text-sm text-gray-600">{formData.name}</p>
                  <p className="text-sm text-gray-600">{formData.address}, {formData.city}, {formData.state} {formData.zipCode}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Contact Information</h4>
                  <p className="text-sm text-gray-600">{formData.adminName}</p>
                  <p className="text-sm text-gray-600">{formData.adminEmail}</p>
                  <p className="text-sm text-gray-600">{formData.adminPhone}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Business Setup</h4>
                  <p className="text-sm text-gray-600">Initial Fleet Size: {formData.initialFleetSize} vehicles</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            {step < 4 ? (
              <button
                onClick={handleNext}
                className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
              >
                Create Location
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
