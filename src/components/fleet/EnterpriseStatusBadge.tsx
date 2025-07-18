/*
 * Enterprise Status Badge Component
 * World-class status indicators with semantic meaning and accessibility
 */

import React from 'react'

export type VehicleStatus = 'available' | 'rented' | 'maintenance' | 'out_of_service'

interface EnterpriseStatusBadgeProps {
  status: VehicleStatus
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const EnterpriseStatusBadge: React.FC<EnterpriseStatusBadgeProps> = ({ 
  status, 
  size = 'md',
  className = '' 
}) => {
  // Professional status configuration with semantic meaning
  const statusConfig = {
    available: {
      label: 'Available',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-800',
      borderColor: 'border-emerald-200',
      dotColor: 'bg-emerald-500',
      description: 'Ready for rental'
    },
    rented: {
      label: 'In Service',
      bgColor: 'bg-blue-50', 
      textColor: 'text-blue-800',
      borderColor: 'border-blue-200',
      dotColor: 'bg-blue-500',
      description: 'Currently rented'
    },
    maintenance: {
      label: 'Maintenance',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-800', 
      borderColor: 'border-amber-200',
      dotColor: 'bg-amber-500',
      description: 'Under service'
    },
    out_of_service: {
      label: 'Offline',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-800',
      borderColor: 'border-gray-200', 
      dotColor: 'bg-gray-500',
      description: 'Not in service'
    }
  }

  const config = statusConfig[status]
  
  // Size configurations
  const sizeConfig = {
    sm: {
      padding: 'px-2 py-1',
      text: 'text-xs',
      dot: 'w-1.5 h-1.5',
      gap: 'gap-1.5'
    },
    md: {
      padding: 'px-3 py-1.5', 
      text: 'text-sm',
      dot: 'w-2 h-2',
      gap: 'gap-2'
    },
    lg: {
      padding: 'px-4 py-2',
      text: 'text-base',
      dot: 'w-2.5 h-2.5', 
      gap: 'gap-2.5'
    }
  }

  const sizeStyles = sizeConfig[size]

  return (
    <span 
      className={`
        inline-flex items-center font-medium rounded-full border
        ${sizeStyles.padding} ${sizeStyles.text} ${sizeStyles.gap}
        ${config.bgColor} ${config.textColor} ${config.borderColor}
        ${className}
      `}
      aria-label={`Vehicle status: ${config.label} - ${config.description}`}
      title={config.description}
    >
      <div 
        className={`rounded-full ${sizeStyles.dot} ${config.dotColor}`}
        aria-hidden="true"
      />
      <span>{config.label}</span>
    </span>
  )
}
