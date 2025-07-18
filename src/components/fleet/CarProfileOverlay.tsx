/*
 * Car Profile Overlay Component - Professional vehicle management for RENTAGAIN
 * Features: Cover photo header, editable vehicle details, gas/mileage calculator
 * Design: Contact book-style modal with modern profile layout and working calculator
 */

import React, { useState, useCallback } from 'react'
import { 
  X,
  Car,
  FileText,
  FloppyDisk,
  Trash,
  MapPin,
  GasPump,
  CurrencyDollar,
  Gauge,
  Calculator,
  TrendUp
} from 'phosphor-react'
import { Button, Card } from '../ui'

// Vehicle data interface matching our fleet management system
export interface VehicleData {
  id: string
  make: string
  model: string
  year: number
  licensePlate: string
  color: string
  location: string
  fuelType: string
  dailyRate: number
  mileage: number
  status: 'available' | 'rented' | 'maintenance' | 'out_of_service'
  // Gas/Mileage tracking data
  fuelCapacity?: number
  mpg?: number
  currentFuelLevel?: number
  lastOdometerReading?: number
}

// Gas/Mileage Calculator Component
const GasMileageCalculator = ({ vehicle }: { vehicle: VehicleData }) => {
  const [startMileage, setStartMileage] = useState<string>('')
  const [endMileage, setEndMileage] = useState<string>('')
  const [gallonsUsed, setGallonsUsed] = useState<string>('')
  const [fuelCost, setFuelCost] = useState<string>('')
  const [results, setResults] = useState<{
    mpg: number
    costPerMile: number
    totalDistance: number
    costPerGallon: number
  } | null>(null)

  const calculateMileage = useCallback(() => {
    const start = parseFloat(startMileage)
    const end = parseFloat(endMileage)
    const gallons = parseFloat(gallonsUsed)
    const cost = parseFloat(fuelCost)

    if (isNaN(start) || isNaN(end) || isNaN(gallons) || isNaN(cost) || gallons <= 0 || end <= start) {
      alert('Please enter valid numbers. End mileage must be greater than start mileage.')
      return
    }

    const totalDistance = end - start
    const mpg = totalDistance / gallons
    const costPerGallon = cost / gallons
    const costPerMile = cost / totalDistance

    setResults({
      mpg: Math.round(mpg * 100) / 100,
      costPerMile: Math.round(costPerMile * 100) / 100,
      totalDistance,
      costPerGallon: Math.round(costPerGallon * 100) / 100
    })
  }, [startMileage, endMileage, gallonsUsed, fuelCost])

  const resetCalculator = () => {
    setStartMileage('')
    setEndMileage('')
    setGallonsUsed('')
    setFuelCost('')
    setResults(null)
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
        <Calculator size={20} className="text-green-600" />
        <span>Gas & Mileage Calculator</span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="start-mileage" className="block text-sm font-medium text-gray-700 mb-1">
            Starting Odometer Reading
          </label>
          <div className="relative">
            <Gauge size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              id="start-mileage"
              type="number"
              value={startMileage}
              onChange={(e) => setStartMileage(e.target.value)}
              placeholder="e.g., 15420"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="end-mileage" className="block text-sm font-medium text-gray-700 mb-1">
            Ending Odometer Reading
          </label>
          <div className="relative">
            <Gauge size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              id="end-mileage"
              type="number"
              value={endMileage}
              onChange={(e) => setEndMileage(e.target.value)}
              placeholder="e.g., 15720"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="gallons-used" className="block text-sm font-medium text-gray-700 mb-1">
            Gallons of Fuel Used
          </label>
          <div className="relative">
            <GasPump size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              id="gallons-used"
              type="number"
              step="0.01"
              value={gallonsUsed}
              onChange={(e) => setGallonsUsed(e.target.value)}
              placeholder="e.g., 12.5"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="fuel-cost" className="block text-sm font-medium text-gray-700 mb-1">
            Total Fuel Cost ($)
          </label>
          <div className="relative">
            <CurrencyDollar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              id="fuel-cost"
              type="number"
              step="0.01"
              value={fuelCost}
              onChange={(e) => setFuelCost(e.target.value)}
              placeholder="e.g., 45.50"
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="flex space-x-3 mb-6">
        <Button
          onClick={calculateMileage}
          className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
        >
          <Calculator size={16} />
          <span>Calculate</span>
        </Button>
        <Button
          variant="outline"
          onClick={resetCalculator}
          className="flex items-center space-x-2"
        >
          <X size={16} />
          <span>Reset</span>
        </Button>
      </div>

      {results && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-semibold text-green-900 mb-3 flex items-center space-x-2">
            <TrendUp size={16} />
            <span>Calculation Results</span>
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">{results.mpg}</div>
              <div className="text-sm text-green-600">Miles per Gallon</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">${results.costPerMile}</div>
              <div className="text-sm text-green-600">Cost per Mile</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">{results.totalDistance}</div>
              <div className="text-sm text-green-600">Miles Driven</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">${results.costPerGallon}</div>
              <div className="text-sm text-green-600">Cost per Gallon</div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

interface CarProfileOverlayProps {
  vehicle: VehicleData
  isOpen: boolean
  onClose: () => void
  onSave: (vehicleData: VehicleData) => void
  onDelete?: (vehicleId: string) => void
}

// Helper component for rendering form fields
const FormField = ({ 
  id, 
  label, 
  value, 
  isEditing, 
  onChange, 
  type = 'text',
  options = [],
  icon: Icon,
  iconClassName = "text-gray-500",
  displayValue,
  placeholder = "",
  className = ""
}: {
  id: string
  label: string
  value: string | number
  isEditing: boolean
  onChange: (value: string) => void
  type?: 'text' | 'date' | 'select' | 'textarea' | 'number'
  options?: { value: string; label: string }[]
  icon?: React.ComponentType<{ size: number; className?: string }>
  iconClassName?: string
  displayValue?: React.ReactNode
  placeholder?: string
  className?: string
}) => {
  if (type === 'select') {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        {isEditing ? (
          <select
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {options.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        ) : (
          displayValue || (
            <p className="text-gray-900 py-2 flex items-center space-x-1">
              {Icon && <Icon size={16} className={iconClassName} />}
              <span>{String(value)}</span>
            </p>
          )
        )}
      </div>
    )
  }

  if (type === 'number') {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        {isEditing ? (
          <input
            id={id}
            type="number"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
            placeholder={placeholder}
          />
        ) : (
          displayValue || (
            <p className={`text-gray-900 py-2 ${Icon ? 'flex items-center space-x-1' : ''}`}>
              {Icon && <Icon size={16} className={iconClassName} />}
              <span>{String(value)}</span>
            </p>
          )
        )}
      </div>
    )
  }

  if (type === 'textarea') {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        {isEditing ? (
          <textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder={placeholder}
          />
        ) : (
          <div className="bg-gray-50 rounded-md p-3 min-h-[100px]">
            <p className="text-gray-900 whitespace-pre-wrap">
              {value || "No notes available"}
            </p>
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      {isEditing ? (
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
          placeholder={placeholder}
        />
      ) : (
        displayValue || (
          <p className={`text-gray-900 py-2 ${Icon ? 'flex items-center space-x-1' : ''}`}>
            {Icon && <Icon size={16} className={iconClassName} />}
            <span>{String(value)}</span>
          </p>
        )
      )}
    </div>
  )
}

export function CarProfileOverlay({ 
  vehicle, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete 
}: Readonly<CarProfileOverlayProps>) {
  const [formData, setFormData] = useState<VehicleData>(vehicle)
  const [isEditing, setIsEditing] = useState(false)

  if (!isOpen) return null

  // Handle form field updates
  const handleFieldChange = (field: keyof VehicleData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Handle save action
  const handleSave = () => {
    onSave(formData)
    setIsEditing(false)
  }

  // Handle delete action
  const handleDelete = () => {
    if (onDelete && window.confirm('Are you sure you want to delete this vehicle?')) {
      onDelete(vehicle.id)
      onClose()
    }
  }

  // Get status styling
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rented':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'out_of_service':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  // Get status dot color
  const getStatusDotColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500'
      case 'rented':
        return 'bg-blue-500'
      case 'maintenance':
        return 'bg-yellow-500'
      case 'out_of_service':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Professional backdrop with subtle blur effect */}
        <button
          className="fixed inset-0 backdrop-blur-sm transition-all duration-300 ease-out opacity-100"
          style={{ 
            backgroundColor: 'rgba(17, 24, 39, 0.25)',
            backdropFilter: 'blur(4px) saturate(1.8)',
            zIndex: 999998
          }}
          onClick={onClose}
          onKeyDown={(e) => e.key === 'Escape' && onClose()}
          aria-label="Close modal"
        />
        
        {/* Car Profile Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[95vh] overflow-hidden border border-gray-200" style={{ zIndex: 999999 }}>
          {/* Clean Header */}
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

            {/* Vehicle Title */}
            <div className="pr-16">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-200">
                  <Car size={24} className="text-gray-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{formData.make} {formData.model}</h2>
                  <p className="text-sm text-gray-500">{formData.year} • {formData.licensePlate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="overflow-y-auto max-h-[calc(95vh-12rem)]">
            {/* Vehicle Information Section */}
            <div className="p-8 space-y-8">
              {/* Basic Vehicle Info */}
              <Card className="p-8 shadow-sm border-gray-100">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Car size={20} className="text-blue-600" />
                    </div>
                    <span>Vehicle Details</span>
                  </h3>
                  {!isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-blue-50 hover:border-blue-200 transition-all"
                    >
                      <FileText size={16} />
                      <span>Edit Information</span>
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <FormField
                  id="make-field"
                  label="Make"
                  value={formData.make}
                  isEditing={isEditing}
                  onChange={(value) => handleFieldChange('make', value)}
                />

                <FormField
                  id="status-field"
                  label="Status"
                  value={formData.status}
                  isEditing={isEditing}
                  onChange={(value) => handleFieldChange('status', value)}
                  type="select"
                  options={[
                    { value: 'available', label: 'Available' },
                    { value: 'rented', label: 'Rented' },
                    { value: 'maintenance', label: 'Maintenance' },
                    { value: 'out_of_service', label: 'Out of Service' }
                  ]}
                  displayValue={
                    <div className="py-2">
                      <span className={`inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full border ${getStatusStyle(formData.status)}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${getStatusDotColor(formData.status)}`} />
                        {formData.status.charAt(0).toUpperCase() + formData.status.slice(1).replace('_', ' ')}
                      </span>
                    </div>
                  }
                />

                <FormField
                  id="model-field"
                  label="Model"
                  value={formData.model}
                  isEditing={isEditing}
                  onChange={(value) => handleFieldChange('model', value)}
                />

                <FormField
                  id="year-field"
                  label="Year"
                  value={formData.year}
                  isEditing={isEditing}
                  onChange={(value) => handleFieldChange('year', value)}
                  type="number"
                />

                <FormField
                  id="license-plate-field"
                  label="License Plate"
                  value={formData.licensePlate}
                  isEditing={isEditing}
                  onChange={(value) => handleFieldChange('licensePlate', value)}
                  displayValue={
                    <div className="py-2">
                      <span className="inline-block text-gray-900 font-mono bg-gray-50 border border-gray-200 px-3 py-2 rounded-lg text-sm font-medium">
                        {formData.licensePlate}
                      </span>
                    </div>
                  }
                />

                <FormField
                  id="color-field"
                  label="Color"
                  value={formData.color}
                  isEditing={isEditing}
                  onChange={(value) => handleFieldChange('color', value)}
                />

                <FormField
                  id="location-field"
                  label="Location"
                  value={formData.location}
                  isEditing={isEditing}
                  onChange={(value) => handleFieldChange('location', value)}
                  icon={MapPin}
                  iconClassName="text-blue-500"
                />

                <FormField
                  id="fuel-type-field"
                  label="Fuel Type"
                  value={formData.fuelType}
                  isEditing={isEditing}
                  onChange={(value) => handleFieldChange('fuelType', value)}
                  type="select"
                  options={[
                    { value: 'Gasoline', label: 'Gasoline' },
                    { value: 'Diesel', label: 'Diesel' },
                    { value: 'Electric', label: 'Electric' },
                    { value: 'Hybrid', label: 'Hybrid' },
                    { value: 'Premium', label: 'Premium' }
                  ]}
                  icon={GasPump}
                  iconClassName="text-orange-500"
                />

                <FormField
                  id="daily-rate-field"
                  label="Daily Rate"
                  value={formData.dailyRate}
                  isEditing={isEditing}
                  onChange={(value) => handleFieldChange('dailyRate', value)}
                  type="number"
                  placeholder="0.00"
                  icon={CurrencyDollar}
                  iconClassName="text-green-600"
                  displayValue={
                    <div className="py-2 flex items-center space-x-2">
                      <CurrencyDollar size={18} className="text-green-600" />
                      <span className="text-xl font-bold text-green-700">${formData.dailyRate}</span>
                      <span className="text-sm text-gray-500">per day</span>
                    </div>
                  }
                />

                <FormField
                  id="mileage-field"
                  label="Mileage"
                  value={formData.mileage}
                  isEditing={isEditing}
                  onChange={(value) => handleFieldChange('mileage', value)}
                  type="number"
                  icon={Gauge}
                  displayValue={
                    <div className="py-2 flex items-center space-x-2">
                      <Gauge size={18} className="text-purple-500" />
                      <span className="text-lg font-semibold text-gray-900">{formData.mileage.toLocaleString()}</span>
                      <span className="text-sm text-gray-500">miles</span>
                    </div>
                  }
                />
              </div>
            </Card>



            {/* Gas & Mileage Calculator */}
            <GasMileageCalculator vehicle={formData} />

            {/* Action Buttons */}
            <div className="px-8 py-6 bg-gray-50 border-t border-gray-200">
              {isEditing ? (
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false)
                      setFormData(vehicle) // Reset to original data
                    }}
                    className="flex-1 flex items-center justify-center space-x-2 py-3"
                  >
                    <X size={18} />
                    <span>Cancel Changes</span>
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 py-3"
                  >
                    <FloppyDisk size={18} />
                    <span>Save Changes</span>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                  {onDelete && (
                    <Button
                      variant="outline"
                      onClick={handleDelete}
                      className="text-red-600 hover:text-red-700 hover:border-red-300 hover:bg-red-50 flex items-center justify-center space-x-2 py-3"
                    >
                      <Trash size={18} />
                      <span>Delete Vehicle</span>
                    </Button>
                  )}
                  <div className="flex flex-col sm:flex-row gap-4 sm:ml-auto">
                    <Button
                      onClick={onClose}
                      className="flex items-center justify-center space-x-2 py-3 px-6"
                    >
                      <span>Close Profile</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  )
}

export default CarProfileOverlay
