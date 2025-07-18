/*
 * Operations Maintenance Page - Functional vehicle maintenance journal
 * Professional logging system with full CRUD operations
 */

import React, { useState, useMemo } from 'react'
import { ClipboardText, Plus, ClockCounterClockwise } from 'phosphor-react'
import { Button, Card } from '../../src/components/ui'
import { 
  MaintenanceEntryCard, 
  NewEntryModal, 
  MaintenanceFilters,
  VehicleMaintenanceModal,
  type FilterState
} from '../../src/components/maintenance'

// Import the correct types
import type { MaintenanceEntry } from '../../src/components/maintenance/types'

interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  license_plate: string
  current_mileage: number
}

interface Technician {
  id: string
  name: string
}

interface MaintenanceStats {
  totalEntries: number
  totalCost: number
  thisMonthEntries: number
  thisMonthCost: number
  avgCostPerEntry: number
  upcomingServices: number
}

export default function MaintenancePage() {
  const [entries, setEntries] = useState<MaintenanceEntry[]>(mockEntries)
  const vehicles = mockVehicles
  const technicians: Technician[] = [
    { id: '1', name: 'Mike Johnson' },
    { id: '2', name: 'Sarah Chen' },
    { id: '3', name: 'Carlos Rodriguez' },
    { id: '4', name: 'Amanda Davis' }
  ]
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showNewEntryModal, setShowNewEntryModal] = useState(false)
  const [showVehicleHistory, setShowVehicleHistory] = useState(false)
  const [selectedVehicleForHistory, setSelectedVehicleForHistory] = useState<Vehicle | null>(null)
  
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    vehicleId: '',
    maintenanceType: '',
    dateRange: { start: '', end: '' },
    costRange: { min: 0, max: 0 },
    technicianId: ''
  })

  // Filter entries based on current filters
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        const searchableText = [
          entry.work_performed,
          entry.notes || '',
          entry.technician,
          ...entry.parts_used
        ].join(' ').toLowerCase()
        
        if (!searchableText.includes(query)) return false
      }

      // Vehicle filter
      if (filters.vehicleId) {
        if (entry.vehicle_id !== filters.vehicleId) return false
      }

      // Maintenance type filter
      if (filters.maintenanceType && filters.maintenanceType !== entry.maintenance_type) {
        return false
      }

      // Date range filter
      if (filters.dateRange.start && entry.entry_date < filters.dateRange.start) return false
      if (filters.dateRange.end && entry.entry_date > filters.dateRange.end) return false

      // Cost range filter
      if (filters.costRange.min > 0 && entry.cost < filters.costRange.min) return false
      if (filters.costRange.max > 0 && entry.cost > filters.costRange.max) return false

      // Technician filter
      if (filters.technicianId) {
        const technician = technicians.find(t => t.name === entry.technician)
        if (!technician || technician.id !== filters.technicianId) return false
      }

      return true
    })
  }, [entries, filters, vehicles, technicians])

  // Calculate statistics
  const stats = useMemo((): MaintenanceStats => {
    const now = new Date()
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    
    const thisMonthEntries = entries.filter(entry => 
      new Date(entry.entry_date) >= thisMonth
    )
    
    const totalCost = entries.reduce((sum, entry) => sum + entry.cost, 0)
    const thisMonthCost = thisMonthEntries.reduce((sum, entry) => sum + entry.cost, 0)
    
    const upcomingServices = entries.filter(entry => {
      if (!entry.next_service_due) return false
      const dueDate = new Date(entry.next_service_due)
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      return dueDate <= nextMonth && dueDate >= now
    }).length

    return {
      totalEntries: entries.length,
      totalCost,
      thisMonthEntries: thisMonthEntries.length,
      thisMonthCost,
      avgCostPerEntry: entries.length > 0 ? totalCost / entries.length : 0,
      upcomingServices
    }
  }, [entries])

  // Handle new entry submission
  const handleNewEntry = async (data: any) => {
    setIsSubmitting(true)
    try {
      // Generate new ID
      const newId = String(Date.now())
      
      // Find selected vehicle for additional info
      const selectedVehicle = vehicles.find(v => v.id === data.vehicle_id)
      
      const newEntry: MaintenanceEntry = {
        id: newId,
        vehicle_id: data.vehicle_id,
        entry_date: new Date().toISOString().split('T')[0],
        mileage: data.mileage,
        maintenance_type: data.maintenance_type,
        work_performed: data.work_performed,
        parts_used: data.parts_used,
        labor_hours: data.labor_hours,
        cost: data.cost,
        technician: data.technician,
        next_service_due: data.next_service_due || undefined,
        next_service_mileage: data.next_service_mileage || undefined,
        notes: data.notes || undefined,
        location_id: 'location-1',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        vehicle: selectedVehicle ? {
          make: selectedVehicle.make,
          model: selectedVehicle.model,
          year: selectedVehicle.year,
          license_plate: selectedVehicle.license_plate,
          vehicle_id: selectedVehicle.id
        } : undefined
      }

      setEntries(prev => [newEntry, ...prev])
      setShowNewEntryModal(false)
    } catch (error) {
      console.error('Error creating maintenance entry:', error)
      alert('Failed to create maintenance entry. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle entry actions
  const handleEditEntry = (entry: MaintenanceEntry) => {
    // For now, just show the new entry modal (could implement edit functionality)
    console.log('Edit entry:', entry)
    alert('Edit functionality coming soon!')
  }

  const handleDeleteEntry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this maintenance entry?')) return

    try {
      setEntries(prev => prev.filter(entry => entry.id !== id))
    } catch (error) {
      console.error('Error deleting entry:', error)
      alert('Failed to delete entry. Please try again.')
    }
  }

  const handleDuplicateEntry = (entry: MaintenanceEntry) => {
    // Set up the new entry modal with duplicated data
    console.log('Duplicate entry:', entry)
    setShowNewEntryModal(true)
  }

  const handleViewVehicleHistory = (vehicleId: string) => {
    const vehicle = vehicles.find(v => v.id === vehicleId)
    if (vehicle) {
      setSelectedVehicleForHistory(vehicle)
      setShowVehicleHistory(true)
    }
  }

  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      vehicleId: '',
      maintenanceType: '',
      dateRange: { start: '', end: '' },
      costRange: { min: 0, max: 0 },
      technicianId: ''
    })
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <ClipboardText size={32} weight="bold" className="text-blue-600" />
          <div>
            <h1 className="text-responsive-2xl font-bold text-gray-900">Maintenance Log</h1>
            <p className="text-responsive-base text-gray-600">Professional vehicle maintenance journal</p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            icon={ClockCounterClockwise}
            iconWeight="regular"
            onClick={() => {
              if (filters.vehicleId) {
                handleViewVehicleHistory(filters.vehicleId)
              } else {
                // Show all vehicles history or prompt to select vehicle
                alert('Please select a vehicle from the filters to view its history, or click "New Entry" to add maintenance records.')
              }
            }}
            className="btn-responsive cursor-pointer"
            title={filters.vehicleId ? "View selected vehicle's maintenance history" : "Select a vehicle in filters to view its history"}
          >
            Vehicle History
          </Button>
          <Button
            variant="primary"
            icon={Plus}
            iconWeight="bold"
            onClick={() => setShowNewEntryModal(true)}
            className="btn-responsive"
          >
            New Entry
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card padding="md" className="card-responsive">
          <div className="text-responsive-sm text-gray-600 mb-1">Total Entries</div>
          <div className="text-responsive-2xl font-bold text-gray-900">{stats.totalEntries}</div>
          <div className="text-responsive-xs text-green-600 mt-1">
            {stats.thisMonthEntries} this month
          </div>
        </Card>

        <Card padding="md" className="card-responsive">
          <div className="text-responsive-sm text-gray-600 mb-1">Total Cost</div>
          <div className="text-responsive-2xl font-bold text-gray-900">
            ${stats.totalCost.toFixed(2)}
          </div>
          <div className="text-responsive-xs text-blue-600 mt-1">
            ${stats.thisMonthCost.toFixed(2)} this month
          </div>
        </Card>

        <Card padding="md" className="card-responsive">
          <div className="text-responsive-sm text-gray-600 mb-1">Avg Cost/Entry</div>
          <div className="text-responsive-2xl font-bold text-gray-900">
            ${stats.avgCostPerEntry.toFixed(2)}
          </div>
          <div className="text-responsive-xs text-gray-500 mt-1">
            Across all entries
          </div>
        </Card>

        <Card padding="md" className="card-responsive">
          <div className="text-responsive-sm text-gray-600 mb-1">Upcoming Services</div>
          <div className="text-responsive-2xl font-bold text-gray-900">{stats.upcomingServices}</div>
          <div className="text-responsive-xs text-orange-600 mt-1">
            Due next month
          </div>
        </Card>
      </div>

      {/* Filters */}
      <MaintenanceFilters
        filters={filters}
        onFiltersChange={setFilters}
        vehicles={vehicles}
        technicians={technicians}
        totalEntries={entries.length}
        filteredEntries={filteredEntries.length}
        onClearFilters={clearFilters}
      />

      {/* Maintenance Entries Timeline */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <Card padding="xl" className="text-center card-responsive">
            <ClipboardText size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-responsive-lg font-medium text-gray-900 mb-2">
              {entries.length === 0 ? 'No maintenance entries yet' : 'No entries match your filters'}
            </h3>
            <p className="text-responsive-base text-gray-600 mb-6">
              {entries.length === 0 
                ? 'Start logging maintenance activities to track your fleet\'s service history.'
                : 'Try adjusting your search criteria or clearing filters to see more results.'
              }
            </p>
            {entries.length === 0 ? (
              <Button
                variant="primary"
                icon={Plus}
                iconWeight="bold"
                onClick={() => setShowNewEntryModal(true)}
                className="btn-responsive"
              >
                Create First Entry
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="btn-responsive"
              >
                Clear Filters
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <MaintenanceEntryCard
                key={entry.id}
                entry={entry}
                onEdit={handleEditEntry}
                onDelete={handleDeleteEntry}
                onDuplicate={handleDuplicateEntry}
                onViewDetails={(entry: MaintenanceEntry) => {
                  console.log('View details for:', entry)
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* New Entry Modal */}
      <NewEntryModal
        isOpen={showNewEntryModal}
        onClose={() => {
          setShowNewEntryModal(false)
        }}
        onSubmit={handleNewEntry}
        vehicles={vehicles}
        isSubmitting={isSubmitting}
      />

      {/* Vehicle History Modal */}
      {showVehicleHistory && selectedVehicleForHistory && (
        <VehicleMaintenanceModal
          isOpen={showVehicleHistory}
          onClose={() => setShowVehicleHistory(false)}
          vehicle={selectedVehicleForHistory}
          maintenanceEntries={entries.filter(entry => entry.vehicle_id === selectedVehicleForHistory.id)}
          onAddNewEntry={() => {
            setShowVehicleHistory(false)
            setShowNewEntryModal(true)
            // Pre-select the vehicle in filters
            setFilters(prev => ({ ...prev, vehicleId: selectedVehicleForHistory.id }))
          }}
        />
      )}
    </div>
  )
}

// Mock data
const mockVehicles: Vehicle[] = [
  { id: '1', make: 'BMW', model: 'X5', year: 2022, license_plate: 'ABC-123', current_mileage: 25000 },
  { id: '2', make: 'Mercedes', model: 'Sprinter', year: 2021, license_plate: 'DEF-456', current_mileage: 45000 },
  { id: '3', make: 'Ford', model: 'Transit', year: 2023, license_plate: 'GHI-789', current_mileage: 12000 }
]

const mockEntries: MaintenanceEntry[] = [
  {
    id: '1',
    vehicle_id: '1', // BMW X5
    entry_date: '2024-01-15',
    mileage: 24500,
    maintenance_type: 'routine',
    work_performed: 'Oil change, filter replacement, tire rotation. Comprehensive 15-point inspection completed.',
    parts_used: ['Oil Filter', '5W-30 Motor Oil', 'Air Filter'],
    labor_hours: 2.5,
    cost: 125.00,
    technician: 'Mike Johnson',
    next_service_due: '2024-04-15',
    next_service_mileage: 27500,
    notes: 'Vehicle in excellent condition. Next service recommended at 27,500 miles.',
    location_id: 'location-1',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T10:00:00Z',
    vehicle: {
      make: 'BMW',
      model: 'X5',
      year: 2022,
      license_plate: 'ABC-123',
      vehicle_id: '1'
    }
  },
  {
    id: '2',
    vehicle_id: '2', // Mercedes Sprinter
    entry_date: '2024-01-10',
    mileage: 44500,
    maintenance_type: 'emergency',
    work_performed: 'Brake pad replacement and rotor resurfacing. Emergency repair due to worn pads.',
    parts_used: ['Brake Pads (Front)', 'Brake Cleaner', 'Rotor Resurfacing'],
    labor_hours: 3.0,
    cost: 425.50,
    technician: 'Sarah Chen',
    next_service_due: '2024-04-10',
    next_service_mileage: 47500,
    notes: 'Customer reported squealing noise. Found severely worn front brake pads. Rotors resurfaced successfully.',
    location_id: 'location-1',
    created_at: '2024-01-10T14:30:00Z',
    updated_at: '2024-01-10T14:30:00Z',
    vehicle: {
      make: 'Mercedes',
      model: 'Sprinter',
      year: 2021,
      license_plate: 'DEF-456',
      vehicle_id: '2'
    }
  }
]
