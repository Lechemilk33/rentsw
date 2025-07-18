/*
 * MaintenanceLog - Professional vehicle maintenance journal
 * Timeline-style maintenance tracking with enterprise features
 */

import React, { useState, useEffect, useMemo } from 'react'
import { createClient } from '@supabase/supabase-js'
import { MaintenanceLogHeader } from './MaintenanceLogHeader'
import { MaintenanceEntryCard } from './MaintenanceEntryCard'
import { NewMaintenanceEntryModal } from './NewMaintenanceEntryModal'
import { Card, Loading } from '../ui'
import type { MaintenanceEntry, MaintenanceStats, MaintenanceFilters, NewMaintenanceEntry } from './types'

// Modern Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

interface Vehicle {
  id: string
  vehicle_id: string
  make: string
  model: string
  year: number
  license_plate: string
  current_mileage: number
}

export const MaintenanceLog: React.FC = () => {
  // State management
  const [entries, setEntries] = useState<MaintenanceEntry[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Filters
  const [filters, setFilters] = useState<MaintenanceFilters>({
    vehicleId: null,
    maintenanceType: 'all',
    startDate: null,
    endDate: null,
    searchQuery: ''
  })

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const entriesPerPage = 25

  // Mock session - in production this would come from auth context
  const session = { user: { id: 'mock-user', app_metadata: { location_id: 'test-location-uuid' } } }

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        // Load vehicles first
        await loadVehicles()
        
        // Load maintenance entries
        await loadMaintenanceEntries()
        
      } catch (error) {
        console.error('Error loading data:', error)
        setError('Failed to load maintenance data')
        
        // Use mock data for development
        loadMockData()
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const loadVehicles = async () => {
    const { data, error } = await supabase
      .from('vehicles')
      .select('id, vehicle_id, make, model, year, license_plate, current_mileage')
      .eq('location_id', session.user.app_metadata.location_id)
      .order('make')

    if (error) throw error
    
    if (data) {
      setVehicles(data)
    }
  }

  const loadMaintenanceEntries = async () => {
    const { data, error } = await supabase
      .from('maintenance_entries')
      .select(`
        *,
        vehicle:vehicles(make, model, year, license_plate, vehicle_id)
      `)
      .eq('location_id', session.user.app_metadata.location_id)
      .order('entry_date', { ascending: false })

    if (error) throw error
    
    if (data) {
      setEntries(data.map(entry => ({
        ...entry,
        vehicle: entry.vehicle
      })))
    }
  }

  const loadMockData = () => {
    // Mock vehicles
    const mockVehicles: Vehicle[] = [
      {
        id: 'vehicle-1',
        vehicle_id: 'VH001',
        make: 'BMW',
        model: 'X5',
        year: 2023,
        license_plate: 'ABC-123',
        current_mileage: 15420
      },
      {
        id: 'vehicle-2',
        vehicle_id: 'VH002',
        make: 'Mercedes',
        model: 'E-Class',
        year: 2022,
        license_plate: 'XYZ-789',
        current_mileage: 22340
      }
    ]

    // Mock maintenance entries
    const mockEntries: MaintenanceEntry[] = [
      {
        id: 'entry-1',
        vehicle_id: 'vehicle-1',
        entry_date: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
        mileage: 15420,
        maintenance_type: 'routine',
        work_performed: 'Oil change, filter replacement, and multi-point inspection. Checked tire pressure and brake fluid levels.',
        parts_used: ['Oil Filter', '5W-30 Motor Oil (6 quarts)', 'Air Filter'],
        labor_hours: 1.5,
        cost: 89.99,
        technician: 'Mike Johnson',
        next_service_due: new Date(Date.now() + 86400000 * 90).toISOString(), // 90 days from now
        next_service_mileage: 18420,
        notes: 'Vehicle in excellent condition. No issues found during inspection.',
        location_id: 'test-location-uuid',
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        vehicle: {
          make: 'BMW',
          model: 'X5',
          year: 2023,
          license_plate: 'ABC-123',
          vehicle_id: 'VH001'
        }
      },
      {
        id: 'entry-2',
        vehicle_id: 'vehicle-2',
        entry_date: new Date(Date.now() - 86400000 * 7).toISOString(), // 1 week ago
        mileage: 22340,
        maintenance_type: 'preventive',
        work_performed: 'Brake pad replacement and rotor resurfacing. Brake system flush and new brake fluid.',
        parts_used: ['Front Brake Pads', 'Rear Brake Pads', 'Brake Fluid (DOT 4)', 'Brake Cleaner'],
        labor_hours: 3.0,
        cost: 425.50,
        technician: 'Sarah Davis',
        next_service_due: new Date(Date.now() + 86400000 * 180).toISOString(), // 6 months from now
        next_service_mileage: 32340,
        notes: 'Brake pads were at 20% remaining. Rotors resurfaced successfully. Customer advised on gentle break-in period.',
        location_id: 'test-location-uuid',
        created_at: new Date(Date.now() - 86400000 * 7).toISOString(),
        updated_at: new Date(Date.now() - 86400000 * 7).toISOString(),
        vehicle: {
          make: 'Mercedes',
          model: 'E-Class',
          year: 2022,
          license_plate: 'XYZ-789',
          vehicle_id: 'VH002'
        }
      }
    ]

    setVehicles(mockVehicles)
    setEntries(mockEntries)
  }

  // Filter entries based on current filters
  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      // Vehicle filter
      if (filters.vehicleId && entry.vehicle_id !== filters.vehicleId) {
        return false
      }

      // Maintenance type filter
      if (filters.maintenanceType !== 'all' && entry.maintenance_type !== filters.maintenanceType) {
        return false
      }

      // Date range filter
      if (filters.startDate) {
        const entryDate = new Date(entry.entry_date)
        const startDate = new Date(filters.startDate)
        if (entryDate < startDate) return false
      }

      if (filters.endDate) {
        const entryDate = new Date(entry.entry_date)
        const endDate = new Date(filters.endDate)
        if (entryDate > endDate) return false
      }

      // Search query filter
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase()
        return (
          entry.work_performed.toLowerCase().includes(query) ||
          entry.notes.toLowerCase().includes(query) ||
          entry.technician.toLowerCase().includes(query) ||
          entry.parts_used.some(part => part.toLowerCase().includes(query))
        )
      }

      return true
    })
  }, [entries, filters])

  // Calculate stats
  const stats: MaintenanceStats = useMemo(() => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    const thisMonthEntries = entries.filter(entry => {
      const entryDate = new Date(entry.entry_date)
      return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear
    })

    const totalCost = entries.reduce((sum, entry) => sum + entry.cost, 0)
    
    const upcomingServices = entries.filter(entry => {
      if (!entry.next_service_due) return false
      const dueDate = new Date(entry.next_service_due)
      const thirtyDaysFromNow = new Date(Date.now() + 86400000 * 30)
      return dueDate <= thirtyDaysFromNow
    }).length

    return {
      totalEntries: entries.length,
      thisMonth: thisMonthEntries.length,
      totalCost,
      avgCostPerEntry: entries.length > 0 ? totalCost / entries.length : 0,
      upcomingServices
    }
  }, [entries])

  // Pagination
  const paginatedEntries = useMemo(() => {
    const startIndex = (currentPage - 1) * entriesPerPage
    return filteredEntries.slice(startIndex, startIndex + entriesPerPage)
  }, [filteredEntries, currentPage])

  const totalPages = Math.ceil(filteredEntries.length / entriesPerPage)

  // Handle new entry submission
  const handleNewEntry = async (formData: NewMaintenanceEntry) => {
    setIsSubmitting(true)
    
    try {
      const newEntry = {
        ...formData,
        entry_date: new Date().toISOString(),
        location_id: session.user.app_metadata.location_id
      }

      // Try to insert into Supabase
      const { data, error } = await supabase
        .from('maintenance_entries')
        .insert([newEntry])
        .select(`
          *,
          vehicle:vehicles(make, model, year, license_plate, vehicle_id)
        `)
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      if (data) {
        setEntries(prev => [{ ...data, vehicle: data.vehicle }, ...prev])
      }

    } catch (error) {
      console.error('Error adding maintenance entry:', error)
      
      // Fallback: Add mock entry for development
      const mockEntry: MaintenanceEntry = {
        id: `entry-${Date.now()}`,
        ...formData,
        entry_date: new Date().toISOString(),
        location_id: session.user.app_metadata.location_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        vehicle: vehicles.find(v => v.id === formData.vehicle_id) || {
          make: 'Unknown',
          model: 'Vehicle',
          year: 2023,
          license_plate: 'N/A',
          vehicle_id: 'N/A'
        }
      }
      
      setEntries(prev => [mockEntry, ...prev])
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle filter changes
  const handleFiltersChange = (newFilters: Partial<MaintenanceFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
    setCurrentPage(1) // Reset to first page when filters change
  }

  if (loading) {
    return (
      <div className="container-responsive min-h-screen flex items-center justify-center">
        <Loading size="lg" text="Loading maintenance log..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-responsive min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-responsive-xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-responsive-base text-gray-600">{error}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="container-responsive min-h-screen bg-gray-50">
      {/* Header */}
      <MaintenanceLogHeader
        stats={stats}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onNewEntry={() => setIsModalOpen(true)}
        vehicles={vehicles}
      />

      {/* Maintenance Entries Timeline */}
      <div className="max-w-4xl mx-auto">
        {paginatedEntries.length === 0 ? (
          <Card className="card-responsive p-12 text-center">
            <h3 className="text-responsive-lg font-semibold text-gray-900 mb-2">
              No maintenance entries found
            </h3>
            <p className="text-responsive-base text-gray-600 mb-6">
              {filteredEntries.length === 0 && entries.length === 0
                ? 'Start logging maintenance activities for your fleet'
                : 'Try adjusting your filters to see more entries'
              }
            </p>
            {entries.length === 0 && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-responsive bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create First Entry
              </button>
            )}
          </Card>
        ) : (
          <div className="space-y-6">
            {paginatedEntries.map((entry, index) => (
              <MaintenanceEntryCard
                key={entry.id}
                entry={entry}
                isFirst={index === 0}
                isLast={index === paginatedEntries.length - 1}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="btn-responsive px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              
              <span className="text-responsive-sm text-gray-600 px-4">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="btn-responsive px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* New Entry Modal */}
      <NewMaintenanceEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNewEntry}
        isSubmitting={isSubmitting}
        vehicles={vehicles}
      />
    </div>
  )
}
