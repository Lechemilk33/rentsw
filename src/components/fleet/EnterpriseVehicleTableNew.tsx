/*
 * Enterprise Vehicle Table Component
 * World-class data table following Fortune 500 design standards
 * Features: Bulk selection, professional interactions, accessibility compliance
 */

import React, { useState, useMemo } from 'react'
import { 
  CaretDown, 
  CaretUp, 
  Check, 
  Minus,
  Eye,
  MapPin,
  Gauge
} from 'phosphor-react'
import { EnterpriseStatusBadge } from './EnterpriseStatusBadge'
import { EnterpriseConditionToggle } from './EnterpriseConditionToggle'

interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  license_plate: string
  status: 'available' | 'rented' | 'maintenance' | 'out_of_service'
  location: string
  vin: string
  mileage: number
  is_clean: boolean
  last_service_date: string
}

interface EnterpriseVehicleTableProps {
  vehicles: Vehicle[]
  selectedVehicles: string[]
  onSelectionChange: (selectedIds: string[]) => void
  onVehicleClick: (vehicle: Vehicle) => void
  onStatusChange: (vehicleId: string, newStatus: string) => void
  onConditionToggle: (vehicleId: string) => void
  isLoading?: boolean
  loadingStates?: Record<string, boolean>
  className?: string
}

type SortField = keyof Vehicle
type SortDirection = 'asc' | 'desc'

// Sort icon component extracted to reduce complexity
const SortIcon: React.FC<{ field: SortField; sortField: SortField; sortDirection: SortDirection }> = ({ 
  field, 
  sortField, 
  sortDirection 
}) => {
  if (sortField !== field) return null
  return sortDirection === 'asc' ? 
    <CaretUp size={14} weight="bold" className="text-blue-600" /> : 
    <CaretDown size={14} weight="bold" className="text-blue-600" />
}

export const EnterpriseVehicleTable: React.FC<EnterpriseVehicleTableProps> = ({
  vehicles,
  selectedVehicles,
  onSelectionChange,
  onVehicleClick,
  onStatusChange,
  onConditionToggle,
  isLoading = false,
  loadingStates = {},
  className = ''
}) => {
  const [sortField, setSortField] = useState<SortField>('make')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  // Professional sorting logic
  const sortedVehicles = useMemo(() => {
    return [...vehicles].sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]

      // Handle different data types
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = (bValue as string).toLowerCase()
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
  }, [vehicles, sortField, sortDirection])

  // Selection management
  const isAllSelected = vehicles.length > 0 && selectedVehicles.length === vehicles.length
  const isPartiallySelected = selectedVehicles.length > 0 && selectedVehicles.length < vehicles.length

  const handleHeaderCheckbox = () => {
    if (isAllSelected) {
      onSelectionChange([])
    } else {
      onSelectionChange(vehicles.map(v => v.id))
    }
  }

  const handleRowCheckbox = (vehicleId: string) => {
    if (selectedVehicles.includes(vehicleId)) {
      onSelectionChange(selectedVehicles.filter(id => id !== vehicleId))
    } else {
      onSelectionChange([...selectedVehicles, vehicleId])
    }
  }

  // Sorting handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  // Professional column configuration
  const columns = [
    {
      key: 'selection' as const,
      label: '',
      width: 'w-12',
      sortable: false
    },
    {
      key: 'make' as const,
      label: 'Vehicle',
      width: 'w-48',
      sortable: true
    },
    {
      key: 'license_plate' as const,
      label: 'License Plate',
      width: 'w-32',
      sortable: true
    },
    {
      key: 'status' as const,
      label: 'Status',
      width: 'w-32',
      sortable: true
    },
    {
      key: 'location' as const,
      label: 'Location',
      width: 'w-40',
      sortable: true
    },
    {
      key: 'mileage' as const,
      label: 'Mileage',
      width: 'w-24',
      sortable: true
    },
    {
      key: 'is_clean' as const,
      label: 'Condition',
      width: 'w-32',
      sortable: true
    },
    {
      key: 'actions' as const,
      label: 'Actions',
      width: 'w-20',
      sortable: false
    }
  ]

  // Helper function to get checkbox style classes
  const getCheckboxClasses = (isSelected: boolean, isPartiallySelected: boolean) => {
    if (isSelected || isPartiallySelected) {
      return 'bg-blue-600 border-blue-600 text-white'
    }
    return 'border-gray-300 hover:border-blue-400'
  }

  // Helper function to get checkbox icon
  const getCheckboxIcon = (isSelected: boolean, isPartiallySelected: boolean) => {
    if (isSelected) {
      return <Check size={12} weight="bold" />
    }
    if (isPartiallySelected) {
      return <Minus size={12} weight="bold" />
    }
    return null
  }

  if (isLoading) {
    return (
      <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}>
        <div className="p-8 text-center">
          <div className="inline-flex items-center gap-3 text-gray-600">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            <span className="text-sm font-medium">Loading vehicles...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-200 overflow-hidden ${className}`}>
      {/* Professional Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Enterprise Table Header */}
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`
                    ${column.width} px-6 py-4 text-left
                    ${column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}
                    transition-colors duration-150
                  `}
                  onClick={column.sortable ? () => handleSort(column.key as SortField) : undefined}
                >
                  {column.key === 'selection' ? (
                    <button
                      onClick={handleHeaderCheckbox}
                      className={`
                        w-5 h-5 rounded border-2 flex items-center justify-center
                        transition-all duration-200
                        ${getCheckboxClasses(isAllSelected, isPartiallySelected)}
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      `}
                      aria-label={isAllSelected ? 'Deselect all vehicles' : 'Select all vehicles'}
                    >
                      {getCheckboxIcon(isAllSelected, isPartiallySelected)}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        {column.label}
                      </span>
                      {column.sortable && <SortIcon field={column.key as SortField} sortField={sortField} sortDirection={sortDirection} />}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          {/* Enterprise Table Body */}
          <tbody className="divide-y divide-gray-100">
            {sortedVehicles.map((vehicle) => {
              const isSelected = selectedVehicles.includes(vehicle.id)
              const isUpdating = loadingStates[vehicle.id]

              return (
                <tr
                  key={vehicle.id}
                  className={`
                    hover:bg-gray-50 transition-colors duration-150
                    ${isSelected ? 'bg-blue-50' : ''}
                  `}
                >
                  {/* Selection Column */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleRowCheckbox(vehicle.id)}
                      className={`
                        w-5 h-5 rounded border-2 flex items-center justify-center
                        transition-all duration-200
                        ${getCheckboxClasses(isSelected, false)}
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      `}
                      aria-label={`${isSelected ? 'Deselect' : 'Select'} ${vehicle.make} ${vehicle.model}`}
                    >
                      {getCheckboxIcon(isSelected, false)}
                    </button>
                  </td>

                  {/* Vehicle Info Column */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onVehicleClick(vehicle)}
                      className="text-left group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                    >
                      <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        VIN: {vehicle.vin.slice(-8)}
                      </div>
                    </button>
                  </td>

                  {/* License Plate Column */}
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium text-gray-900 bg-gray-100 px-2 py-1 rounded">
                      {vehicle.license_plate}
                    </span>
                  </td>

                  {/* Status Column */}
                  <td className="px-6 py-4">
                    <EnterpriseStatusBadge status={vehicle.status} size="sm" />
                  </td>

                  {/* Location Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <MapPin size={14} className="text-gray-400" />
                      <span>{vehicle.location}</span>
                    </div>
                  </td>

                  {/* Mileage Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Gauge size={14} className="text-gray-400" />
                      <span>{vehicle.mileage.toLocaleString()}</span>
                    </div>
                  </td>

                  {/* Condition Column */}
                  <td className="px-6 py-4">
                    <EnterpriseConditionToggle
                      isClean={vehicle.is_clean}
                      isUpdating={isUpdating}
                      onToggle={() => onConditionToggle(vehicle.id)}
                      size="sm"
                    />
                  </td>

                  {/* Actions Column */}
                  <td className="px-6 py-4">
                    <button
                      onClick={() => onVehicleClick(vehicle)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      aria-label={`View details for ${vehicle.make} ${vehicle.model}`}
                    >
                      <Eye size={16} weight="regular" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Professional Empty State */}
      {vehicles.length === 0 && (
        <div className="p-12 text-center">
          <div className="text-gray-400 mb-4">
            <Gauge size={48} />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No vehicles found</h3>
          <p className="text-gray-600">Your fleet will appear here once vehicles are added.</p>
        </div>
      )}
    </div>
  )
}

export type { Vehicle }
