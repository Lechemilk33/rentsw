/*
 * VehicleTable Component - Responsive Fleet Data Table
 * Professional table with adaptive scaling and clean design          <tbody>
            {vehicles.map((vehicle) => (
              <tr 
                key={vehicle.id}
                onClick={() => onVehicleClick?.(vehicle)}
                className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
              >*/

import React from 'react'
import { Calculator, CaretUp, CaretDown, Car } from 'phosphor-react'
import { Button } from '../ui'
import { StatusDropdown, type VehicleStatus } from './StatusDropdown'
import { WashStatusToggle } from './WashStatusToggle'

export interface Vehicle {
  id: string
  vehicle_id: string
  make: string
  model: string
  year: number
  status: VehicleStatus
  license_plate: string
  wash_status: boolean
  current_mileage: number
  last_mileage_update: string
  created_at: string
  updated_at: string
  location_id: string
  photo_url?: string
}

export interface SortConfig {
  key: keyof Vehicle | null
  direction: 'asc' | 'desc'
}

interface VehicleTableProps {
  vehicles: Vehicle[]
  sortConfig: SortConfig
  onSort: (key: keyof Vehicle) => void
  updatingVehicles: Set<string>
  onWashStatusToggle: (vehicleId: string, currentStatus: boolean) => void
  onVehicleClick?: (vehicle: Vehicle) => void
}

export const VehicleTable: React.FC<VehicleTableProps> = React.memo(({
  vehicles,
  sortConfig,
  onSort,
  updatingVehicles,
  onWashStatusToggle,
  onVehicleClick
}) => {
  // Format mileage with commas
  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-US').format(mileage) + ' miles'
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get sort icon
  const getSortIcon = (column: keyof Vehicle) => {
    if (sortConfig.key !== column) {
      return <CaretUp size={14} weight="light" className="text-gray-400" />
    }
    return sortConfig.direction === 'asc' 
      ? <CaretUp size={14} weight="bold" className="text-gray-600" />
      : <CaretDown size={14} weight="bold" className="text-gray-600" />
  }

  return (
    <div className="w-full overflow-hidden">
      <div className="min-w-full overflow-x-auto">
        <table className="professional-table">
          <colgroup>
            <col className="w-[20%] min-w-[200px]" /> {/* Vehicle: 20% */}
            <col className="w-[15%] min-w-[120px]" /> {/* Status: 15% */}
            <col className="w-[12%] min-w-[100px]" /> {/* Wash: 12% */}
            <col className="w-[15%] min-w-[120px]" /> {/* Mileage: 15% */}
            <col className="w-[15%] min-w-[120px]" /> {/* Updated: 15% */}
            <col className="w-[23%] min-w-[180px]" /> {/* Actions: 23% */}
          </colgroup>
          <thead>
            <tr>
              <th 
                className="cursor-pointer hover:text-gray-700 transition-colors"
                onClick={() => onSort('make')}
              >
                <div className="flex items-center gap-2">
                  Vehicle
                  {getSortIcon('make')}
                </div>
              </th>
              <th>Status</th>
              <th>Wash</th>
              <th 
                className="cursor-pointer hover:text-gray-700 transition-colors"
                onClick={() => onSort('current_mileage')}
              >
                <div className="flex items-center gap-2">
                  Mileage
                  {getSortIcon('current_mileage')}
                </div>
              </th>
              <th 
                className="cursor-pointer hover:text-gray-700 transition-colors"
                onClick={() => onSort('updated_at')}
              >
                <div className="flex items-center gap-2">
                  Updated
                  {getSortIcon('updated_at')}
                </div>
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr 
                key={vehicle.id}
                onClick={() => onVehicleClick?.(vehicle)}
                className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
              >
                {/* Vehicle Column */}
                <td>
                  <div className="flex items-center gap-3 min-w-0">
                    <Car size={20} weight="regular" className="text-gray-600 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-responsive-sm font-medium text-gray-900 truncate" title={vehicle.make}>
                        {vehicle.make}
                      </div>
                      <div className="text-responsive-xs text-gray-500 truncate" title={`${vehicle.model} (${vehicle.year})`}>
                        {vehicle.model} ({vehicle.year})
                      </div>
                    </div>
                  </div>
                </td>
                
                {/* Status Column */}
                <td onClick={(e) => e.stopPropagation()}>
                  <StatusDropdown status={vehicle.status} />
                </td>
                
                {/* Wash Status Column */}
                <td onClick={(e) => e.stopPropagation()}>
                  <WashStatusToggle
                    isWashed={vehicle.wash_status}
                    isUpdating={updatingVehicles.has(vehicle.id)}
                    onToggle={() => onWashStatusToggle(vehicle.id, vehicle.wash_status)}
                  />
                </td>
                
                {/* Mileage Column */}
                <td>
                  <div className="text-responsive-sm font-medium text-gray-900">
                    {formatMileage(vehicle.current_mileage)}
                  </div>
                  <div className="text-responsive-xs text-gray-500">
                    Last: {formatDate(vehicle.last_mileage_update)}
                  </div>
                </td>
                
                {/* Updated Column */}
                <td>
                  <div className="text-responsive-sm text-gray-500">
                    {formatDate(vehicle.updated_at)}
                  </div>
                </td>
                
                {/* Actions Column */}
                <td onClick={(e) => e.stopPropagation()}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    icon={Calculator} 
                    iconWeight="regular"
                    className="btn-responsive opacity-75 hover:opacity-100 transition-opacity"
                  >
                    Gas Calculator
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
})
