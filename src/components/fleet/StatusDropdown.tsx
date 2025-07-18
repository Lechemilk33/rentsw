/*
 * StatusDropdown Component - Vehicle Status Badge Display
 * Professional status badges with icons and proper styling
 */

import React from 'react'

export type VehicleStatus = 'available' | 'rented' | 'maintenance' | 'out_of_service'

interface StatusDropdownProps {
  status: VehicleStatus
  className?: string
}

export const StatusDropdown: React.FC<StatusDropdownProps> = ({ 
  status, 
  className = '' 
}) => {
  const getStatusBadge = (status: VehicleStatus) => {
    switch (status) {
      case 'available':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Available
          </span>
        )
      case 'rented':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-full">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Rented
          </span>
        )
      case 'maintenance':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-full">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            Maintenance
          </span>
        )
      case 'out_of_service':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-full">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            Out of Service
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-full">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            {status}
          </span>
        )
    }
  }

  return (
    <div className={className}>
      {getStatusBadge(status)}
    </div>
  )
}
