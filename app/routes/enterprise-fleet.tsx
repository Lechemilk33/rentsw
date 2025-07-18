/*
 * Enterprise Fleet Management Page
 * World-class fleet interface following Fortune 500 design standards
 * Complete rebuild with professional design system integration
 */

import React, { useState, useCallback, useMemo } from 'react'
import { FleetHeader } from '../../src/components/fleet/FleetHeader'
import { EnterpriseVehicleTable } from '../../src/components/fleet/EnterpriseVehicleTable'
import type { Vehicle } from '../../src/components/fleet/EnterpriseVehicleTable'

// Mock data for demonstration - replace with actual data service
const mockVehicles: Vehicle[] = [
  {
    id: '1',
    make: 'Toyota',
    model: 'Camry',
    year: 2023,
    license_plate: 'ABC-123',
    status: 'available',
    location: 'Downtown Lot A',
    vin: 'JTD3B11U9X0123456',
    mileage: 15420,
    is_clean: true,
    last_service_date: '2024-01-15'
  },
  {
    id: '2',
    make: 'Honda',
    model: 'Accord',
    year: 2022,
    license_plate: 'XYZ-789',
    status: 'rented',
    location: 'Airport Location',
    vin: 'JTD3B11U9X0789012',
    mileage: 28350,
    is_clean: false,
    last_service_date: '2024-01-10'
  },
  {
    id: '3',
    make: 'Ford',
    model: 'Explorer',
    year: 2023,
    license_plate: 'DEF-456',
    status: 'maintenance',
    location: 'Service Center',
    vin: 'JTD3B11U9X0456789',
    mileage: 12680,
    is_clean: true,
    last_service_date: '2024-01-20'
  },
  {
    id: '4',
    make: 'Chevrolet',
    model: 'Malibu',
    year: 2024,
    license_plate: 'GHI-101',
    status: 'available',
    location: 'Downtown Lot B',
    vin: 'JTD3B11U9X0101112',
    mileage: 8920,
    is_clean: true,
    last_service_date: '2024-01-25'
  },
  {
    id: '5',
    make: 'Nissan',
    model: 'Altima',
    year: 2022,
    license_plate: 'JKL-202',
    status: 'out_of_service',
    location: 'Repair Shop',
    vin: 'JTD3B11U9X0202303',
    mileage: 45670,
    is_clean: false,
    last_service_date: '2024-01-05'
  }
]

export default function EnterpriseFleetPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles)
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([])
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<Vehicle['status'] | 'all'>('all')

  // Professional filtering and search
  const filteredVehicles = useMemo(() => {
    return vehicles.filter(vehicle => {
      const matchesSearch = searchQuery === '' || 
        vehicle.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.license_plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vehicle.location.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
  }, [vehicles, searchQuery, statusFilter])

  // Fleet statistics for header
  const fleetStats = useMemo(() => {
    const total = vehicles.length
    const available = vehicles.filter(v => v.status === 'available').length
    const rented = vehicles.filter(v => v.status === 'rented').length
    const maintenance = vehicles.filter(v => v.status === 'maintenance').length
    const utilizationRate = total > 0 ? Math.round((rented / total) * 100) : 0

    return {
      total,
      available,
      rented,
      maintenance,
      utilizationRate
    }
  }, [vehicles])

  // Professional event handlers
  const handleVehicleClick = useCallback((vehicle: Vehicle) => {
    console.log('Opening vehicle profile:', vehicle)
    // TODO: Implement vehicle profile modal/overlay
  }, [])

  const handleStatusChange = useCallback(async (vehicleId: string, newStatus: string) => {
    setLoadingStates(prev => ({ ...prev, [vehicleId]: true }))
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setVehicles(prev => prev.map(vehicle => 
        vehicle.id === vehicleId 
          ? { ...vehicle, status: newStatus as Vehicle['status'] }
          : vehicle
      ))
    } catch (error) {
      console.error('Failed to update vehicle status:', error)
    } finally {
      setLoadingStates(prev => ({ ...prev, [vehicleId]: false }))
    }
  }, [])

  const handleConditionToggle = useCallback(async (vehicleId: string) => {
    setLoadingStates(prev => ({ ...prev, [vehicleId]: true }))
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setVehicles(prev => prev.map(vehicle => 
        vehicle.id === vehicleId 
          ? { ...vehicle, is_clean: !vehicle.is_clean }
          : vehicle
      ))
    } catch (error) {
      console.error('Failed to update vehicle condition:', error)
    } finally {
      setLoadingStates(prev => ({ ...prev, [vehicleId]: false }))
    }
  }, [])

  // Bulk operations
  const handleBulkStatusUpdate = useCallback(async (newStatus: Vehicle['status']) => {
    if (selectedVehicles.length === 0) return
    
    setIsLoading(true)
    try {
      // Simulate bulk API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setVehicles(prev => prev.map(vehicle => 
        selectedVehicles.includes(vehicle.id)
          ? { ...vehicle, status: newStatus }
          : vehicle
      ))
      
      setSelectedVehicles([]) // Clear selection after bulk operation
    } catch (error) {
      console.error('Failed to update vehicle statuses:', error)
    } finally {
      setIsLoading(false)
    }
  }, [selectedVehicles])

  const handleAddVehicle = useCallback(() => {
    console.log('Adding new vehicle...')
    // TODO: Implement add vehicle functionality
  }, [])

  const handleRefresh = useCallback(async () => {
    setIsLoading(true)
    try {
      // Simulate API refresh
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Fleet data refreshed')
    } catch (error) {
      console.error('Failed to refresh fleet data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleExport = useCallback(async () => {
    console.log('Exporting fleet data...')
    // TODO: Implement actual export functionality
  }, [])

  const handleBulkAction = useCallback(() => {
    console.log('Bulk action for selected vehicles:', selectedVehicles)
    // TODO: Implement bulk action menu
  }, [selectedVehicles])

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-base">
      {/* Enterprise Page Container */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Fleet Header */}
        <FleetHeader
          totalVehicles={fleetStats.total}
          selectedCount={selectedVehicles.length}
          onAddVehicle={handleAddVehicle}
          onRefresh={handleRefresh}
          onExport={handleExport}
          onBulkAction={handleBulkAction}
          isLoading={isLoading}
        />

        {/* Professional Spacing */}
        <div className="h-8" />

        {/* Enterprise Vehicle Table */}
        <EnterpriseVehicleTable
          vehicles={filteredVehicles}
          selectedVehicles={selectedVehicles}
          onSelectionChange={setSelectedVehicles}
          onVehicleClick={handleVehicleClick}
          onStatusChange={handleStatusChange}
          onConditionToggle={handleConditionToggle}
          isLoading={isLoading}
          loadingStates={loadingStates}
          className="shadow-sm"
        />

        {/* Professional Footer Spacing */}
        <div className="h-12" />
        
      </div>
    </div>
  )
}
