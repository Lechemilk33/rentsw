/*
 * EditableStatusDropdown Component - Editable Vehicle Status Selector
 * Professional dropdown with click-to-edit functionality
 */

import React, { useState, useRef, useEffect } from 'react'
import { Car, Gear, X, Check, CaretDown } from 'phosphor-react'
import { Badge } from '../ui'

export type VehicleStatus = 'available' | 'rented' | 'maintenance' | 'out_of_service'

interface EditableStatusDropdownProps {
  status: VehicleStatus
  vehicleId: string
  onStatusChange?: (vehicleId: string, newStatus: VehicleStatus) => Promise<void>
  className?: string
  disabled?: boolean
}

export const EditableStatusDropdown: React.FC<EditableStatusDropdownProps> = ({ 
  status, 
  vehicleId,
  onStatusChange,
  className = '',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [currentStatus, setCurrentStatus] = useState(status)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const statusOptions: { value: VehicleStatus; label: string; icon: any; variant: any }[] = [
    { value: 'available', label: 'Available', icon: Car, variant: 'success' },
    { value: 'rented', label: 'Rented', icon: Car, variant: 'info' },
    { value: 'maintenance', label: 'Maintenance', icon: Gear, variant: 'warning' },
    { value: 'out_of_service', label: 'Out of Service', icon: X, variant: 'danger' }
  ]

  const getCurrentStatusConfig = () => {
    return statusOptions.find(option => option.value === currentStatus) || statusOptions[0]
  }

  const getIconColor = (variant: string) => {
    switch (variant) {
      case 'success': return 'text-green-600'
      case 'info': return 'text-blue-600'
      case 'warning': return 'text-yellow-600'
      case 'danger': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const handleStatusSelect = async (newStatus: VehicleStatus) => {
    if (newStatus === currentStatus || disabled) return

    setIsUpdating(true)
    try {
      if (onStatusChange) {
        await onStatusChange(vehicleId, newStatus)
      }
      setCurrentStatus(newStatus)
      setIsOpen(false)
    } catch (error) {
      console.error('Failed to update vehicle status:', error)
      // Optionally show error message here
    } finally {
      setIsUpdating(false)
    }
  }

  const currentConfig = getCurrentStatusConfig()

  if (disabled) {
    return (
      <div className={className}>
        <Badge 
          variant={currentConfig.variant} 
          icon={currentConfig.icon} 
          iconWeight="fill"
        >
          {currentConfig.label}
        </Badge>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Current Status Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isUpdating}
        className={`
          inline-flex items-center space-x-1 transition-all duration-200
          ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}
        `}
        aria-label={`Change status from ${currentConfig.label}`}
      >
        {isUpdating ? (
          <div className="inline-flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
            <Badge variant="default">Updating...</Badge>
          </div>
        ) : (
          <>
            <Badge 
              variant={currentConfig.variant} 
              icon={currentConfig.icon} 
              iconWeight="fill"
            >
              {currentConfig.label}
            </Badge>
            <CaretDown size={12} className="text-gray-400" />
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && !isUpdating && (
        <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[140px] overflow-hidden">
          {statusOptions.map((option) => {
            const isSelected = option.value === currentStatus
            const IconComponent = option.icon
            
            return (
              <button
                key={option.value}
                onClick={() => handleStatusSelect(option.value)}
                className={`
                  w-full flex items-center space-x-2 px-3 py-2 text-sm text-left
                  transition-colors duration-150
                  ${isSelected 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'hover:bg-gray-50 text-gray-700'
                  }
                `}
              >
                {isSelected && <Check size={14} className="text-blue-600 flex-shrink-0" />}
                <IconComponent 
                  size={14} 
                  weight="fill" 
                  className={`flex-shrink-0 ${getIconColor(option.variant)}`}
                />
                <span className="flex-1">{option.label}</span>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
