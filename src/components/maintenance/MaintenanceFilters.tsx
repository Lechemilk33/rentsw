/*
 * MaintenanceFilters - Professional filtering and search system
 * Comprehensive filters for maintenance log navigation
 */

import React from 'react'
import { MagnifyingGlass, FunnelSimple, CalendarBlank, Car, Wrench, X } from 'phosphor-react'
import { Button, Input } from '../ui'

export interface FilterState {
  searchQuery: string
  vehicleId: string
  maintenanceType: string
  dateRange: {
    start: string
    end: string
  }
  costRange: {
    min: number
    max: number
  }
  technicianId: string
}

export interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  license_plate: string
}

export interface Technician {
  id: string
  name: string
}

interface MaintenanceFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  vehicles: Vehicle[]
  technicians: Technician[]
  totalEntries: number
  filteredEntries: number
  onClearFilters: () => void
}

export const MaintenanceFilters: React.FC<MaintenanceFiltersProps> = ({
  filters,
  onFiltersChange,
  vehicles,
  technicians,
  totalEntries,
  filteredEntries,
  onClearFilters
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false)

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const updateDateRange = (field: 'start' | 'end', value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value
      }
    })
  }

  const updateCostRange = (field: 'min' | 'max', value: number) => {
    onFiltersChange({
      ...filters,
      costRange: {
        ...filters.costRange,
        [field]: value
      }
    })
  }

  const hasActiveFilters = 
    filters.searchQuery ||
    filters.vehicleId ||
    filters.maintenanceType ||
    filters.dateRange.start ||
    filters.dateRange.end ||
    filters.costRange.min > 0 ||
    filters.costRange.max > 0 ||
    filters.technicianId

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Search Bar & Toggle */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <MagnifyingGlass 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
            />
            <Input
              placeholder="Search by work performed, parts, or notes..."
              value={filters.searchQuery}
              onChange={(e) => updateFilter('searchQuery', e.target.value)}
              className="pl-10 input-responsive"
              fullWidth
            />
          </div>

          {/* Filter Toggle & Results */}
          <div className="flex items-center gap-3">
            <div className="text-responsive-sm text-gray-600 whitespace-nowrap">
              {filteredEntries === totalEntries 
                ? `${totalEntries} entries`
                : `${filteredEntries} of ${totalEntries} entries`
              }
            </div>
            
            <Button
              variant={hasActiveFilters ? "primary" : "outline"}
              icon={FunnelSimple}
              iconWeight="bold"
              onClick={() => setIsExpanded(!isExpanded)}
              className="btn-responsive"
            >
              Filters
              {hasActiveFilters && (
                <span className="ml-2 bg-white text-blue-600 text-xs px-2 py-1 rounded-full">
                  Active
                </span>
              )}
            </Button>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                icon={X}
                iconWeight="bold"
                onClick={onClearFilters}
                className="btn-responsive text-gray-500 hover:text-gray-700"
                title="Clear all filters"
              />
            )}
          </div>
        </div>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Vehicle Filter */}
            <div>
              <label className="block text-responsive-sm font-medium text-gray-700 mb-2">
                <Car size={16} className="inline mr-2" />
                Vehicle
              </label>
              <select
                value={filters.vehicleId}
                onChange={(e) => updateFilter('vehicleId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-responsive-sm"
              >
                <option value="">All Vehicles</option>
                {vehicles.map((vehicle) => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.make} {vehicle.model} ({vehicle.license_plate})
                  </option>
                ))}
              </select>
            </div>

            {/* Maintenance Type Filter */}
            <div>
              <label className="block text-responsive-sm font-medium text-gray-700 mb-2">
                <Wrench size={16} className="inline mr-2" />
                Maintenance Type
              </label>
              <select
                value={filters.maintenanceType}
                onChange={(e) => updateFilter('maintenanceType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-responsive-sm"
              >
                <option value="">All Types</option>
                <option value="routine">Routine Maintenance</option>
                <option value="emergency">Emergency Repair</option>
                <option value="preventive">Preventive Maintenance</option>
                <option value="inspection">Inspection</option>
              </select>
            </div>

            {/* Technician Filter */}
            <div>
              <label className="block text-responsive-sm font-medium text-gray-700 mb-2">
                Technician
              </label>
              <select
                value={filters.technicianId}
                onChange={(e) => updateFilter('technicianId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-responsive-sm"
              >
                <option value="">All Technicians</option>
                {technicians.map((tech) => (
                  <option key={tech.id} value={tech.id}>
                    {tech.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range */}
            <div className="md:col-span-2">
              <div className="block text-responsive-sm font-medium text-gray-700 mb-2">
                <CalendarBlank size={16} className="inline mr-2" />
                Date Range
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="date-start" className="block text-xs text-gray-500 mb-1">From</label>
                  <input
                    id="date-start"
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) => updateDateRange('start', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-responsive-sm"
                  />
                </div>
                <div>
                  <label htmlFor="date-end" className="block text-xs text-gray-500 mb-1">To</label>
                  <input
                    id="date-end"
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) => updateDateRange('end', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-responsive-sm"
                  />
                </div>
              </div>
            </div>

            {/* Cost Range */}
            <div>
              <div className="block text-responsive-sm font-medium text-gray-700 mb-2">
                Cost Range
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="cost-min" className="block text-xs text-gray-500 mb-1">Min ($)</label>
                  <input
                    id="cost-min"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0"
                    value={filters.costRange.min || ''}
                    onChange={(e) => updateCostRange('min', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-responsive-sm"
                  />
                </div>
                <div>
                  <label htmlFor="cost-max" className="block text-xs text-gray-500 mb-1">Max ($)</label>
                  <input
                    id="cost-max"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="No limit"
                    value={filters.costRange.max || ''}
                    onChange={(e) => updateCostRange('max', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-responsive-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Filter Actions */}
          {hasActiveFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-responsive-sm text-gray-600">
                  {filteredEntries} {filteredEntries === 1 ? 'entry' : 'entries'} match your filters
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearFilters}
                  className="btn-responsive"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
