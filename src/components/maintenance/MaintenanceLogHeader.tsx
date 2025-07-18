/*
 * MaintenanceLogHeader - Professional journal-style header
 * Current stats and filtering controls
 */

import React, { useState } from 'react'
import { ClipboardText, Plus, Download, ClockCounterClockwise } from 'phosphor-react'
import { Button, Card, Input } from '../ui'
import { VehicleMaintenanceModal } from './VehicleMaintenanceModal'
import type { MaintenanceStats, MaintenanceFilters } from './types'

interface MaintenanceLogHeaderProps {
  stats: MaintenanceStats
  filters: MaintenanceFilters
  onFiltersChange: (filters: Partial<MaintenanceFilters>) => void
  onNewEntry: () => void
  vehicles: Array<{ 
    id: string
    make: string
    model: string
    year: number
    license_plate: string
    current_mileage: number
  }>
}

export const MaintenanceLogHeader: React.FC<MaintenanceLogHeaderProps> = ({
  stats,
  filters,
  onFiltersChange,
  onNewEntry,
  vehicles
}) => {
  const [showVehicleHistory, setShowVehicleHistory] = useState(false)
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null)

  const currentDate = new Date()
  const formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const handleViewVehicleHistory = (vehicleId: string) => {
    setSelectedVehicleId(vehicleId)
    setShowVehicleHistory(true)
  }

  const selectedVehicle = selectedVehicleId 
    ? vehicles.find(v => v.id === selectedVehicleId)
    : null

  return (
    <div className="container-responsive mb-8">
      {/* Main Header */}
      <div className="mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-responsive-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <ClipboardText size={32} weight="bold" className="text-blue-600" />
              Maintenance Log
            </h1>
            <p className="text-responsive-base text-gray-600 font-mono">
              {formattedDate}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              icon={ClockCounterClockwise}
              iconWeight="regular"
              className="btn-responsive"
              onClick={() => {
                if (filters.vehicleId) {
                  handleViewVehicleHistory(filters.vehicleId)
                }
              }}
              disabled={!filters.vehicleId}
            >
              Vehicle History
            </Button>
            <Button
              variant="outline"
              icon={Download}
              iconWeight="regular"
              className="btn-responsive"
            >
              Export Log
            </Button>
            <Button
              variant="primary"
              icon={Plus}
              iconWeight="bold"
              className="btn-responsive"
              onClick={onNewEntry}
            >
              New Entry
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="card-responsive p-4">
          <div className="text-center">
            <div className="text-responsive-2xl font-bold text-gray-900">
              {stats.totalEntries}
            </div>
            <div className="text-responsive-sm text-gray-600">Total Entries</div>
          </div>
        </Card>
        
        <Card className="card-responsive p-4">
          <div className="text-center">
            <div className="text-responsive-2xl font-bold text-blue-600">
              {stats.thisMonth}
            </div>
            <div className="text-responsive-sm text-gray-600">This Month</div>
          </div>
        </Card>
        
        <Card className="card-responsive p-4">
          <div className="text-center">
            <div className="text-responsive-2xl font-bold text-green-600">
              ${stats.totalCost.toLocaleString()}
            </div>
            <div className="text-responsive-sm text-gray-600">Total Cost</div>
          </div>
        </Card>
        
        <Card className="card-responsive p-4">
          <div className="text-center">
            <div className="text-responsive-2xl font-bold text-orange-600">
              {stats.upcomingServices}
            </div>
            <div className="text-responsive-sm text-gray-600">Due Soon</div>
          </div>
        </Card>
      </div>

      {/* Filter Controls */}
      <Card className="card-responsive p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-responsive-sm font-medium text-gray-700 mb-2">
              Search Entries
            </label>
            <Input
              placeholder="Search work performed, notes..."
              value={filters.searchQuery}
              onChange={(e) => onFiltersChange({ searchQuery: e.target.value })}
              fullWidth
              className="input-responsive"
            />
          </div>

          {/* Vehicle Filter */}
          <div>
            <label className="block text-responsive-sm font-medium text-gray-700 mb-2">
              Vehicle
            </label>
            <select
              value={filters.vehicleId || ''}
              onChange={(e) => onFiltersChange({ vehicleId: e.target.value || null })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-responsive-base"
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
              Type
            </label>
            <select
              value={filters.maintenanceType}
              onChange={(e) => onFiltersChange({ 
                maintenanceType: e.target.value as MaintenanceFilters['maintenanceType'] 
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-responsive-base"
            >
              <option value="all">All Types</option>
              <option value="routine">Routine</option>
              <option value="emergency">Emergency</option>
              <option value="preventive">Preventive</option>
              <option value="inspection">Inspection</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-responsive-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <Input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => onFiltersChange({ startDate: e.target.value || null })}
              fullWidth
              className="input-responsive"
            />
          </div>
        </div>
      </Card>

      {/* Vehicle History Modal */}
      {showVehicleHistory && selectedVehicle && (
        <VehicleMaintenanceModal
          isOpen={showVehicleHistory}
          onClose={() => setShowVehicleHistory(false)}
          vehicle={selectedVehicle}
        />
      )}
    </div>
  )
}
