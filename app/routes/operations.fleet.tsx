/*
 * Fleet Management Page - Enterprise Vehicle Management Interface  
 * Complete rebuild using enterprise-grade components and design system
 */

import React, { useState, useCallback, useMemo } from 'react'
import { FleetHeader } from '../../src/components/fleet/FleetHeader'
import { EnterpriseVehicleTable } from '../../src/components/fleet/EnterpriseVehicleTable'
import { CarProfileOverlay } from '../../src/components/fleet/CarProfileOverlay'
import { LocationViewerOverlay } from '../../src/components/fleet/LocationViewerOverlay'
import { AddVehicleOverlay } from '../../src/components/fleet/AddVehicleOverlay'
import { GasCalculatorModal } from '../../src/components/fleet/GasCalculatorModal'
import type { Vehicle } from '../../src/components/fleet/EnterpriseVehicleTable'
import type { VehicleData } from '../../src/components/fleet/CarProfileOverlay'

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
    last_service_date: '2024-01-15',
    wash_last_updated: '2024-01-15T14:30:00Z',
    current_mileage: 15420
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
    last_service_date: '2024-01-10',
    wash_last_updated: '2024-01-08T09:15:00Z',
    current_mileage: 28350
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
    last_service_date: '2024-01-20',
    wash_last_updated: '2024-01-20T16:45:00Z',
    current_mileage: 12680
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
    last_service_date: '2024-01-25',
    wash_last_updated: '2024-01-25T11:20:00Z',
    current_mileage: 8920
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
    last_service_date: '2024-01-05',
    current_mileage: 45670
  }
]

export default function FleetPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>(mockVehicles)
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([])
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = useState(false)
  
  // Car Profile Overlay state
  const [selectedVehicleForProfile, setSelectedVehicleForProfile] = useState<VehicleData | null>(null)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  // Location Viewer Overlay state
  const [selectedVehicleForLocation, setSelectedVehicleForLocation] = useState<Vehicle | null>(null)
  const [isLocationViewerOpen, setIsLocationViewerOpen] = useState(false)

  // Add Vehicle Overlay state
  const [isAddVehicleOpen, setIsAddVehicleOpen] = useState(false)

  // Gas Calculator Modal state
  const [selectedVehicleForCalculator, setSelectedVehicleForCalculator] = useState<Vehicle | null>(null)
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false)

  // Gas Calculator Modal state
  const [selectedVehicleForGasCalculator, setSelectedVehicleForGasCalculator] = useState<Vehicle | null>(null)
  const [isGasCalculatorOpen, setIsGasCalculatorOpen] = useState(false)

  // Fleet statistics for header
  const fleetStats = useMemo(() => {
    const total = vehicles.length
    const available = vehicles.filter(v => v.status === 'available').length
    const rented = vehicles.filter(v => v.status === 'rented').length
    const maintenance = vehicles.filter(v => v.status === 'maintenance').length

    return {
      total,
      available,
      rented,
      maintenance
    }
  }, [vehicles])

  // Convert Vehicle to VehicleData for profile overlay
  const convertToVehicleData = (vehicle: Vehicle): VehicleData => ({
    id: vehicle.id,
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    licensePlate: vehicle.license_plate,
    color: 'Unknown', // Default value since not in Vehicle interface
    location: vehicle.location,
    fuelType: 'Gasoline', // Default value
    dailyRate: 89.99, // Default value
    mileage: vehicle.mileage,
    status: vehicle.status,
    fuelCapacity: 16, // Default capacity in gallons
    mpg: 28, // Default MPG
    currentFuelLevel: 75, // Default fuel level percentage
    lastOdometerReading: vehicle.mileage
  })

  // Professional event handlers
  const handleVehicleClick = useCallback((vehicle: Vehicle) => {
    const vehicleData = convertToVehicleData(vehicle)
    setSelectedVehicleForProfile(vehicleData)
    setIsProfileOpen(true)
  }, [])

  const handleProfileClose = useCallback(() => {
    setIsProfileOpen(false)
    setSelectedVehicleForProfile(null)
  }, [])

  const handleProfileSave = useCallback((updatedVehicleData: VehicleData) => {
    // Update the vehicle in our fleet list
    setVehicles(prev => prev.map(vehicle => 
      vehicle.id === updatedVehicleData.id 
        ? {
            ...vehicle,
            make: updatedVehicleData.make,
            model: updatedVehicleData.model,
            year: updatedVehicleData.year,
            license_plate: updatedVehicleData.licensePlate,
            location: updatedVehicleData.location,
            mileage: updatedVehicleData.mileage,
            status: updatedVehicleData.status
          }
        : vehicle
    ))
    
    // Update the profile data for the overlay
    setSelectedVehicleForProfile(updatedVehicleData)
    console.log('Vehicle updated:', updatedVehicleData)
  }, [])

  const handleVehicleDelete = useCallback((vehicleId: string) => {
    setVehicles(prev => prev.filter(vehicle => vehicle.id !== vehicleId))
    setIsProfileOpen(false)
    setSelectedVehicleForProfile(null)
    console.log('Vehicle deleted:', vehicleId)
  }, [])

  // Location viewer handlers
  const handleLocationView = useCallback((vehicle: Vehicle) => {
    setSelectedVehicleForLocation(vehicle)
    setIsLocationViewerOpen(true)
  }, [])

  const handleLocationViewerClose = useCallback(() => {
    setIsLocationViewerOpen(false)
    setSelectedVehicleForLocation(null)
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
      
      const now = new Date().toISOString()
      
      setVehicles(prev => prev.map(vehicle => 
        vehicle.id === vehicleId 
          ? { 
              ...vehicle, 
              is_clean: !vehicle.is_clean,
              wash_last_updated: now
            }
          : vehicle
      ))
    } catch (error) {
      console.error('Failed to update vehicle condition:', error)
    } finally {
      setLoadingStates(prev => ({ ...prev, [vehicleId]: false }))
    }
  }, [])

  // Gas calculator handlers
  const handleGasCalculatorOpen = useCallback((vehicle: Vehicle) => {
    setSelectedVehicleForGasCalculator(vehicle)
    setIsGasCalculatorOpen(true)
  }, [])

  const handleGasCalculatorClose = useCallback(() => {
    setIsGasCalculatorOpen(false)
    setSelectedVehicleForGasCalculator(null)
  }, [])

  const handleAddVehicle = useCallback(() => {
    setIsAddVehicleOpen(true)
  }, [])

  // Add vehicle handlers
  const handleAddVehicleClose = useCallback(() => {
    setIsAddVehicleOpen(false)
  }, [])

  const handleAddVehicleSave = useCallback((vehicleData: Omit<Vehicle, 'id'>) => {
    // Generate a new ID for the vehicle
    const newId = (Math.max(...vehicles.map(v => parseInt(v.id))) + 1).toString()
    
    const newVehicle: Vehicle = {
      id: newId,
      ...vehicleData
    }
    
    setVehicles(prev => [...prev, newVehicle])
    console.log('Vehicle added:', newVehicle)
  }, [vehicles])

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
    // Export functionality will be implemented later
  }, [])

  const handleBulkAction = useCallback(() => {
    console.log('Bulk action for selected vehicles:', selectedVehicles)
    // Bulk action menu will be implemented later
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
          vehicles={vehicles}
          selectedVehicles={selectedVehicles}
          onSelectionChange={setSelectedVehicles}
          onVehicleClick={handleVehicleClick}
          onLocationView={handleLocationView}
          onStatusChange={handleStatusChange}
          onConditionToggle={handleConditionToggle}
          onGasCalculatorOpen={handleGasCalculatorOpen}
          isLoading={isLoading}
          loadingStates={loadingStates}
          className="shadow-sm"
        />

        {/* Professional Footer Spacing */}
        <div className="h-12" />
        
      </div>

      {/* Car Profile Overlay */}
      {selectedVehicleForProfile && (
        <CarProfileOverlay
          vehicle={selectedVehicleForProfile}
          isOpen={isProfileOpen}
          onClose={handleProfileClose}
          onSave={handleProfileSave}
          onDelete={handleVehicleDelete}
        />
      )}

      {/* Location Viewer Overlay */}
      {selectedVehicleForLocation && (
        <LocationViewerOverlay
          vehicle={selectedVehicleForLocation}
          isOpen={isLocationViewerOpen}
          onClose={handleLocationViewerClose}
        />
      )}

      {/* Add Vehicle Overlay */}
      <AddVehicleOverlay
        isOpen={isAddVehicleOpen}
        onClose={handleAddVehicleClose}
        onSave={handleAddVehicleSave}
      />

      {/* Gas Calculator Modal */}
      <GasCalculatorModal
        vehicle={selectedVehicleForGasCalculator}
        isOpen={isGasCalculatorOpen}
        onClose={handleGasCalculatorClose}
      />
    </div>
  )
}
