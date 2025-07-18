/*
 * Fleet Management Page - Enterprise Vehicle Management Interface
 * Comprehensive fleet management with professional data presentation
 */

import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { useSearchParams } from 'react-router'
import { createClient } from '@supabase/supabase-js'
import { 
  Button, 
  Card, 
  Input, 
  Loading 
} from '../../src/components/ui'
import { 
  Car, 
  MagnifyingGlass, 
  Plus, 
  Calculator, 
  Eye, 
  Gear,
  CaretUp,
  CaretDown,
  X,
  Sparkle,
  Drop,
  Gauge,
  GasPump,
  CurrencyDollar,
  TrendUp
} from 'phosphor-react'

// Modern Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

// Vehicle interface for type safety with photo support
interface Vehicle {
  id: string
  vehicle_id: string
  make: string
  model: string
  year: number
  status: 'available' | 'rented' | 'maintenance' | 'out_of_service'
  license_plate: string
  wash_status: boolean
  wash_last_updated: string // New field to track when wash status was last changed
  current_mileage: number
  last_mileage_update: string
  created_at: string
  updated_at: string
  location_id: string
  photo_url?: string
}

// Gas Calculator Modal Component  
interface GasCalculatorModalProps {
  isOpen: boolean
  onClose: () => void
  vehicle: Vehicle | null
}

const GasCalculatorModal: React.FC<GasCalculatorModalProps> = ({ isOpen, onClose, vehicle }) => {
  const [startMileage, setStartMileage] = useState<string>('')
  const [endMileage, setEndMileage] = useState<string>('')
  const [gallonsUsed, setGallonsUsed] = useState<string>('')
  const [fuelCost, setFuelCost] = useState<string>('')
  const [results, setResults] = useState<{
    mpg: number
    costPerMile: number
    totalDistance: number
    costPerGallon: number
  } | null>(null)

  // Pre-populate with vehicle's current mileage when opened
  useEffect(() => {
    if (isOpen && vehicle) {
      setStartMileage(vehicle.current_mileage.toString())
      setEndMileage('')
      setGallonsUsed('')
      setFuelCost('')
      setResults(null)
    }
  }, [isOpen, vehicle])

  const calculateMileage = useCallback(() => {
    const start = parseFloat(startMileage)
    const end = parseFloat(endMileage)
    const gallons = parseFloat(gallonsUsed)
    const cost = parseFloat(fuelCost)

    if (isNaN(start) || isNaN(end) || isNaN(gallons) || isNaN(cost) || gallons <= 0 || end <= start) {
      alert('Please enter valid numbers. End mileage must be greater than start mileage.')
      return
    }

    const totalDistance = end - start
    const mpg = totalDistance / gallons
    const costPerGallon = cost / gallons
    const costPerMile = cost / totalDistance

    setResults({
      mpg: Math.round(mpg * 100) / 100,
      costPerMile: Math.round(costPerMile * 100) / 100,
      totalDistance,
      costPerGallon: Math.round(costPerGallon * 100) / 100
    })
  }, [startMileage, endMileage, gallonsUsed, fuelCost])

  const resetCalculator = () => {
    setStartMileage(vehicle?.current_mileage.toString() || '')
    setEndMileage('')
    setGallonsUsed('')
    setFuelCost('')
    setResults(null)
  }

  if (!isOpen || !vehicle) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-sm transition-all duration-300 ease-out opacity-100"
        style={{ 
          backgroundColor: 'rgba(17, 24, 39, 0.25)',
          backdropFilter: 'blur(4px) saturate(1.8)'
        }}
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
              <Calculator size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Gas & Mileage Calculator</h2>
              <p className="text-sm text-gray-600">{vehicle.make} {vehicle.model} ({vehicle.year}) • {vehicle.license_plate}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close calculator"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Calculator Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="start-mileage" className="block text-sm font-medium text-gray-700 mb-1">
                Starting Odometer Reading
              </label>
              <div className="relative">
                <Gauge size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="start-mileage"
                  type="number"
                  value={startMileage}
                  onChange={(e) => setStartMileage(e.target.value)}
                  placeholder="Current mileage"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="end-mileage" className="block text-sm font-medium text-gray-700 mb-1">
                Ending Odometer Reading
              </label>
              <div className="relative">
                <Gauge size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="end-mileage"
                  type="number"
                  value={endMileage}
                  onChange={(e) => setEndMileage(e.target.value)}
                  placeholder="After trip mileage"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="gallons-used" className="block text-sm font-medium text-gray-700 mb-1">
                Gallons of Fuel Used
              </label>
              <div className="relative">
                <GasPump size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="gallons-used"
                  type="number"
                  step="0.01"
                  value={gallonsUsed}
                  onChange={(e) => setGallonsUsed(e.target.value)}
                  placeholder="e.g., 12.5"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label htmlFor="fuel-cost" className="block text-sm font-medium text-gray-700 mb-1">
                Total Fuel Cost ($)
              </label>
              <div className="relative">
                <CurrencyDollar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="fuel-cost"
                  type="number"
                  step="0.01"
                  value={fuelCost}
                  onChange={(e) => setFuelCost(e.target.value)}
                  placeholder="e.g., 45.50"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-3 mb-6">
            <Button
              onClick={calculateMileage}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
            >
              <Calculator size={16} />
              <span>Calculate</span>
            </Button>
            <Button
              variant="outline"
              onClick={resetCalculator}
              className="flex items-center space-x-2"
            >
              <X size={16} />
              <span>Reset</span>
            </Button>
          </div>

          {results && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-900 mb-3 flex items-center space-x-2">
                <TrendUp size={16} />
                <span>Calculation Results</span>
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-700">{results.mpg}</div>
                  <div className="text-sm text-green-600">Miles per Gallon</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-700">${results.costPerMile}</div>
                  <div className="text-sm text-green-600">Cost per Mile</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-700">{results.totalDistance}</div>
                  <div className="text-sm text-green-600">Miles Driven</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-700">${results.costPerGallon}</div>
                  <div className="text-sm text-green-600">Cost per Gallon</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Vehicle image component with lazy loading and placeholder
const VehicleImage: React.FC<{ vehicle: Vehicle; size?: 'sm' | 'md' | 'lg' }> = ({ 
  vehicle, 
  size = 'sm' 
}) => {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  
  const sizeClasses = {
    sm: 'w-12 h-8',
    md: 'w-16 h-11', 
    lg: 'w-24 h-16'
  }
  
  const handleImageLoad = () => {
    setImageLoading(false)
  }
  
  const handleImageError = () => {
    setImageLoading(false)
    setImageError(true)
  }
  
  return (
    <div className={`${sizeClasses[size]} bg-gray-100 rounded-md overflow-hidden relative flex-shrink-0`}>
      {vehicle.photo_url && !imageError ? (
        <>
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            </div>
          )}
          <img
            src={vehicle.photo_url}
            alt={`${vehicle.make} ${vehicle.model}`}
            className={`w-full h-full object-cover ${imageLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
          />
        </>
      ) : (
        /* Placeholder with vehicle icon */
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <Car size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} weight="light" className="text-gray-400" />
        </div>
      )}
    </div>
  )
}

// Fleet status type for filtering
type FleetStatus = 'all' | 'available' | 'rented' | 'maintenance' | 'out_of_service'

// Sort configuration
interface SortConfig {
  key: keyof Vehicle | null
  direction: 'asc' | 'desc'
}

/**
 * Fleet Management Page
 * 
 * Professional vehicle management interface with:
 * - Responsive data table with sorting
 * - Advanced filtering and search
 * - URL state management
 * - Bulk actions and individual controls
 * - Enterprise-grade UX patterns
 */
export default function FleetPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  
  // State management
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<FleetStatus>('all')
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' })
  const [selectedVehicles, setSelectedVehicles] = useState<Set<string>>(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [updatingVehicles, setUpdatingVehicles] = useState<Set<string>>(new Set())
  const [calculatorModal, setCalculatorModal] = useState<{
    isOpen: boolean
    vehicle: Vehicle | null
  }>({ isOpen: false, vehicle: null })
  
  // Pagination configuration
  const itemsPerPage = 10
  
  // Mock session - in production this would come from auth context
  const session = { user: { id: 'mock-user', app_metadata: { location_id: 'test-location-uuid' } } }

  // Initialize filters from URL params
  useEffect(() => {
    const status = searchParams.get('status') as FleetStatus
    const search = searchParams.get('search') || ''
    const page = parseInt(searchParams.get('page') || '1')
    
    if (status && ['available', 'rented', 'maintenance', 'out_of_service'].includes(status)) {
      setStatusFilter(status)
    }
    setSearchQuery(search)
    setCurrentPage(page)
  }, [searchParams])

  // Fetch vehicles data with proper Supabase integration
  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Production Supabase query with new fields
      const { data: vehicles, error: fetchError } = await supabase
        .from('vehicles')
        .select(`
          id,
          vehicle_id,
          make,
          model,
          year,
          status,
          license_plate,
          wash_status,
          wash_last_updated,
          current_mileage,
          last_mileage_update,
          created_at,
          updated_at,
          location_id,
          photo_url
        `)
        .eq('location_id', session?.user?.app_metadata?.location_id)
        .order('updated_at', { ascending: false })

      if (fetchError) {
        // If table doesn't exist yet, use mock data
        if (fetchError.code === '42P01') {
          console.warn('Vehicles table not found, using mock data')
          await useMockData()
          return
        }
        throw fetchError
      }

      setVehicles(vehicles || [])
      
    } catch (err) {
      console.error('Error fetching vehicles:', err)
      // Fallback to mock data on any error
      await useMockData()
    } finally {
      setLoading(false)
    }
  }, [session?.user?.app_metadata?.location_id])
  // Mock data fallback function
  const useMockData = async () => {
    // Mock data for development with new wash status and mileage fields
    const mockVehicles: Vehicle[] = [
      {
        id: '1',
        vehicle_id: 'LAM-001',
        make: 'Lamborghini',
        model: 'Huracán',
        year: 2023,
        status: 'available',
        license_plate: 'LAM-123',
        wash_status: true,
        wash_last_updated: '2024-07-14T14:00:00Z',
        current_mileage: 12450,
        last_mileage_update: '2024-07-14T16:30:00Z',
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-07-14T16:30:00Z',
        location_id: 'test-location-uuid',
        photo_url: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=300&h=200&fit=crop&crop=center'
      },
      {
        id: '2', 
        vehicle_id: 'FER-002',
        make: 'Ferrari',
        model: '488 GTB',
        year: 2022,
        status: 'rented',
        license_plate: 'FER-456',
        wash_status: false,
        wash_last_updated: '2024-07-12T09:00:00Z',
        current_mileage: 28750,
        last_mileage_update: '2024-07-15T09:15:00Z',
        created_at: '2024-01-20T14:00:00Z',
        updated_at: '2024-07-15T09:15:00Z',
        location_id: 'test-location-uuid',
        photo_url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=300&h=200&fit=crop&crop=center'
      },
      {
        id: '3',
        vehicle_id: 'POR-003', 
        make: 'Porsche',
        model: '911 Turbo S',
        year: 2023,
        status: 'maintenance',
        license_plate: 'POR-789',
        wash_status: false,
        wash_last_updated: '2024-07-10T16:30:00Z',
        current_mileage: 15320,
        last_mileage_update: '2024-07-13T11:45:00Z',
        created_at: '2024-02-01T09:00:00Z',
        updated_at: '2024-07-13T11:45:00Z',
        location_id: 'test-location-uuid',
        photo_url: undefined
      },
      {
        id: '4',
        vehicle_id: 'MCL-004',
        make: 'McLaren',
        model: '720S',
        year: 2022,
        status: 'available',
        license_plate: 'MCL-321',
        wash_status: true,
        wash_last_updated: '2024-07-14T11:15:00Z',
        current_mileage: 8960,
        last_mileage_update: '2024-07-14T14:20:00Z',
        created_at: '2024-02-10T13:00:00Z',
        updated_at: '2024-07-14T14:20:00Z',
        location_id: 'test-location-uuid',
        photo_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop&crop=center'
      },
      {
        id: '5',
        vehicle_id: 'BEN-005',
        make: 'Bentley',
        model: 'Continental GT',
        year: 2023,
        status: 'out_of_service',
        license_plate: 'BEN-654',
        wash_status: false,
        wash_last_updated: '2024-07-11T13:45:00Z',
        current_mileage: 22100,
        last_mileage_update: '2024-07-12T08:30:00Z',
        created_at: '2024-02-15T11:00:00Z',
        updated_at: '2024-07-12T08:30:00Z',
        location_id: 'test-location-uuid',
        photo_url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=300&h=200&fit=crop&crop=center'
      },
      {
        id: '6',
        vehicle_id: 'AST-006',
        make: 'Aston Martin',
        model: 'DB11',
        year: 2023,
        status: 'available',
        license_plate: 'AST-987',
        wash_status: true,
        wash_last_updated: '2024-07-15T10:30:00Z',
        current_mileage: 5420,
        last_mileage_update: '2024-07-15T12:00:00Z',
        created_at: '2024-03-01T15:00:00Z',
        updated_at: '2024-07-15T12:00:00Z',
        location_id: 'test-location-uuid',
        photo_url: undefined
      }
    ]

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    setVehicles(mockVehicles)
  }

  // UseEffect to fetch vehicles
  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  // Memoized vehicle filtering and search for performance
  const filteredVehicles = useMemo(() => {
    let filtered = vehicles

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.status === statusFilter)
    }

    // Apply search filter with debounced query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(vehicle => 
        vehicle.make.toLowerCase().includes(query) ||
        vehicle.model.toLowerCase().includes(query) ||
        vehicle.license_plate.toLowerCase().includes(query) ||
        vehicle.vehicle_id.toLowerCase().includes(query)
      )
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered = [...filtered].sort((a, b) => {
        const aValue = a[sortConfig.key!]
        const bValue = b[sortConfig.key!]
        
        if ((aValue ?? 0) < (bValue ?? 0)) return sortConfig.direction === 'asc' ? -1 : 1
        if ((aValue ?? 0) > (bValue ?? 0)) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }

    return filtered
  }, [vehicles, statusFilter, searchQuery, sortConfig])

  // Memoized pagination calculations
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedVehicles = filteredVehicles.slice(startIndex, startIndex + itemsPerPage)
    
    return {
      totalPages,
      startIndex,
      paginatedVehicles
    }
  }, [filteredVehicles, currentPage, itemsPerPage])

  const { totalPages, startIndex, paginatedVehicles } = paginationData

  // Update URL params when filters change
  const updateUrlParams = (updates: Record<string, string | number | null>) => {
    const newParams = new URLSearchParams(searchParams)
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'all') {
        newParams.delete(key)
      } else {
        newParams.set(key, String(value))
      }
    })
    
    setSearchParams(newParams)
  }

  // Debounced search with performance optimization
  const [searchInput, setSearchInput] = useState('')
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput)
      setCurrentPage(1)
      updateUrlParams({ search: searchInput || null, page: 1 })
    }, 300)

    return () => clearTimeout(timer)
  }, [searchInput])

  // Handle search input changes
  const handleSearchInput = (value: string) => {
    setSearchInput(value)
  }

  // Handle status filter
  const handleStatusFilter = (status: FleetStatus) => {
    setStatusFilter(status)
    setCurrentPage(1)
    updateUrlParams({ status: status === 'all' ? null : status, page: 1 })
  }

  // Handle vehicle status update
  const handleStatusUpdate = async (vehicleId: string, newStatus: Vehicle['status']) => {
    try {
      // Update the vehicle status in the database
      const { error } = await supabase
        .from('vehicles')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', vehicleId)

      if (error) {
        console.error('Error updating vehicle status:', error)
        // For now, update locally even if database update fails
      }

      // Update local state immediately for better UX
      setVehicles(prevVehicles => 
        prevVehicles.map(vehicle => 
          vehicle.id === vehicleId 
            ? { ...vehicle, status: newStatus, updated_at: new Date().toISOString() }
            : vehicle
        )
      )

    } catch (error) {
      console.error('Error updating vehicle status:', error)
      // Update local state anyway for demo purposes
      setVehicles(prevVehicles => 
        prevVehicles.map(vehicle => 
          vehicle.id === vehicleId 
            ? { ...vehicle, status: newStatus, updated_at: new Date().toISOString() }
            : vehicle
        )
      )
    }
  }

  // Handle sorting
  const handleSort = (key: keyof Vehicle) => {
    let direction: 'asc' | 'desc' = 'asc'
    
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    
    setSortConfig({ key, direction })
  }

  // Handle vehicle selection
  const handleVehicleSelect = (vehicleId: string) => {
    const newSelected = new Set(selectedVehicles)
    if (newSelected.has(vehicleId)) {
      newSelected.delete(vehicleId)
    } else {
      newSelected.add(vehicleId)
    }
    setSelectedVehicles(newSelected)
  }

  // Handle select all
  const handleSelectAll = () => {
    if (selectedVehicles.size === paginatedVehicles.length) {
      setSelectedVehicles(new Set())
    } else {
      setSelectedVehicles(new Set(paginatedVehicles.map(v => v.id)))
    }
  }

  // Optimistic wash status toggle with rollback on error
  const handleWashStatusToggle = async (vehicleId: string, currentStatus: boolean) => {
    // Add to updating state
    setUpdatingVehicles(prev => new Set(prev).add(vehicleId))
    
    // Optimistic update
    const previousVehicles = vehicles
    setVehicles(prev => prev.map(vehicle => 
      vehicle.id === vehicleId 
        ? { 
            ...vehicle, 
            wash_status: !currentStatus,
            wash_last_updated: new Date().toISOString()
          }
        : vehicle
    ))

    try {
      // Database update
      const { error } = await supabase
        .from('vehicles')
        .update({ 
          wash_status: !currentStatus,
          wash_last_updated: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', vehicleId)
        .eq('location_id', session?.user?.app_metadata?.location_id)

      if (error) throw error

      // TODO: Show success toast
      console.log('Wash status updated successfully')
      
    } catch (error) {
      console.error('Error updating wash status:', error)
      
      // Rollback optimistic update
      setVehicles(previousVehicles)
      
      // TODO: Show error toast
      console.error('Failed to update wash status')
    } finally {
      // Remove from updating state
      setUpdatingVehicles(prev => {
        const newSet = new Set(prev)
        newSet.delete(vehicleId)
        return newSet
      })
    }
  }

  // Open gas calculator modal for specific vehicle
  const openCalculator = (vehicle: Vehicle) => {
    setCalculatorModal({ isOpen: true, vehicle })
  }

  // Close gas calculator modal
  const closeCalculator = () => {
    setCalculatorModal({ isOpen: false, vehicle: null })
  }

  // Format mileage with commas
  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('en-US').format(mileage) + ' miles'
  }

  // Enhanced wash status component with loading states
  const getWashStatus = (vehicle: Vehicle) => {
    const isWashed = vehicle.wash_status
    const isUpdating = updatingVehicles.has(vehicle.id)
    
    // Determine button styling
    let buttonClasses = 'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 '
    
    if (isUpdating) {
      buttonClasses += 'bg-gray-50 text-gray-400 cursor-not-allowed'
    } else if (isWashed) {
      buttonClasses += 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 shadow-sm hover:shadow-md'
    } else {
      buttonClasses += 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 shadow-sm hover:shadow-md'
    }

    // Determine button content
    let buttonContent
    if (isUpdating) {
      buttonContent = (
        <>
          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          <span>Updating...</span>
        </>
      )
    } else if (isWashed) {
      buttonContent = (
        <>
          <Sparkle size={16} weight="fill" className="text-green-600" />
          <span>Washed</span>
        </>
      )
    } else {
      buttonContent = (
        <>
          <Drop size={16} weight="fill" className="text-orange-600" />
          <span>Needs Wash</span>
        </>
      )
    }
    
    return (
      <button
        onClick={() => !isUpdating && handleWashStatusToggle(vehicle.id, isWashed)}
        disabled={isUpdating}
        className={buttonClasses}
        aria-label={`${isWashed ? 'Mark as needs wash' : 'Mark as washed'}`}
      >
        {buttonContent}
      </button>
    )
  }
  
  // Status dropdown component
  const getStatusDropdown = (vehicle: Vehicle) => {
    const getStatusStyle = (status: Vehicle['status']) => {
      switch (status) {
        case 'available':
          return 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100'
        case 'rented':
          return 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
        case 'maintenance':
          return 'bg-yellow-50 text-yellow-800 border-yellow-200 hover:bg-yellow-100'
        case 'out_of_service':
          return 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100'
        default:
          return 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100'
      }
    }

    const getStatusIcon = (status: Vehicle['status']) => {
      switch (status) {
        case 'available':
          return <Car size={12} weight="fill" className="text-green-600" />
        case 'rented':
          return <Car size={12} weight="bold" className="text-blue-600" />
        case 'maintenance':
          return <Gear size={12} weight="bold" className="text-yellow-600" />
        case 'out_of_service':
          return <X size={12} weight="fill" className="text-red-600" />
        default:
          return <Car size={12} className="text-gray-600" />
      }
    }

    const statusLabels = {
      available: 'Available',
      rented: 'Rented',
      maintenance: 'Maintenance',
      out_of_service: 'Out of Service'
    }
    
    return (
      <div className="relative">
        <select
          value={vehicle.status}
          onChange={(e) => handleStatusUpdate(vehicle.id, e.target.value as Vehicle['status'])}
          className={`
            appearance-none cursor-pointer text-xs font-medium rounded-full border pl-7 pr-8 py-1.5
            transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500
            ${getStatusStyle(vehicle.status)}
          `}
        >
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        
        {/* Icon overlay */}
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
          {getStatusIcon(vehicle.status)}
        </div>
        
        {/* Dropdown arrow */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <CaretDown size={10} className="text-current opacity-60" />
        </div>
      </div>
    )
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

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    updateUrlParams({ page })
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <div className="h-8 bg-gray-200 rounded w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
        <Card padding="lg">
          <Loading size="lg" text="Loading vehicle fleet..." />
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <Card padding="lg" variant="outlined">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">
              <X size={48} weight="light" className="mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Fleet</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  return (
    /* Fleet Content Only - No Full Page Wrapper (handled by parent) */
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Fleet Management</h1>
            <p className="text-gray-600">
              Manage your luxury vehicle fleet with enterprise-grade controls
            </p>
          </div>
          <div className="flex gap-3">
            {selectedVehicles.size > 0 && (
              <Button variant="outline" icon={Gear} iconWeight="regular">
                Bulk Actions ({selectedVehicles.size})
              </Button>
            )}
            <Button variant="primary" icon={Plus} iconWeight="bold">
              Add Vehicle
            </Button>
          </div>
        </div>
      </div>

        {/* Enhanced Filters and Search */}
        <Card padding="md" className="mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Debounced Search Input */}
            <div className="flex-1">
              <Input
                icon={MagnifyingGlass}
                iconWeight="regular"
                placeholder="Search vehicles by make, model, license plate..."
                value={searchInput}
                onChange={(e) => handleSearchInput(e.target.value)}
                fullWidth
              />
            </div>
            
            {/* Status Filter */}
            <div className="flex gap-2">
              <Button
                variant={statusFilter === 'all' ? 'primary' : 'ghost'}
                size="md"
                onClick={() => handleStatusFilter('all')}
              >
                All ({vehicles.length})
              </Button>
              <Button
                variant={statusFilter === 'available' ? 'primary' : 'ghost'}
                size="md"
                onClick={() => handleStatusFilter('available')}
              >
                Available ({vehicles.filter(v => v.status === 'available').length})
              </Button>
              <Button
                variant={statusFilter === 'rented' ? 'primary' : 'ghost'}
                size="md"
                onClick={() => handleStatusFilter('rented')}
              >
                Rented ({vehicles.filter(v => v.status === 'rented').length})
              </Button>
              <Button
                variant={statusFilter === 'maintenance' ? 'primary' : 'ghost'}
                size="md"
                onClick={() => handleStatusFilter('maintenance')}
              >
                Maintenance ({vehicles.filter(v => v.status === 'maintenance').length})
              </Button>
            </div>
          </div>
        </Card>

        {/* Responsive Data Table - Optimized Column Widths */}
        <Card padding="none" variant="elevated">
          {filteredVehicles.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16">
              <Car size={64} weight="light" className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchQuery || statusFilter !== 'all' ? 'No vehicles found' : 'No vehicles in fleet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Add your first vehicle to get started'
                }
              </p>
              {searchQuery || statusFilter !== 'all' ? (
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchInput('')
                    setSearchQuery('')
                    setStatusFilter('all')
                    updateUrlParams({ search: null, status: null })
                  }}
                >
                  Clear Filters
                </Button>
              ) : (
                <Button variant="primary" icon={Plus} iconWeight="bold">
                  Add Vehicle
                </Button>
              )}
            </div>
          ) : (
            /* Responsive Data Table - No Horizontal Scroll */
            <div className="overflow-hidden">
              <table className="w-full table-fixed">
                <colgroup>
                  <col className="w-[25%]" /> {/* Make/Model with Image: 25% */}
                  <col className="w-[15%]" /> {/* Status: 15% */}
                  <col className="w-[12%]" /> {/* Wash: 12% */}
                  <col className="w-[15%]" /> {/* Mileage: 15% */}
                  <col className="w-[13%]" /> {/* Last Updated: 13% */}
                  <col className="w-[20%]" /> {/* Actions: 20% (Gas Calculator + View Details) */}
                </colgroup>
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th 
                      className="px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                      onClick={() => handleSort('make')}
                    >
                      <div className="flex items-center gap-2">
                        Vehicle
                        {getSortIcon('make')}
                      </div>
                    </th>
                    <th className="px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Wash
                    </th>
                    <th 
                      className="px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                      onClick={() => handleSort('current_mileage')}
                    >
                      <div className="flex items-center gap-2">
                        Mileage
                        {getSortIcon('current_mileage')}
                      </div>
                    </th>
                    <th className="px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-3 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedVehicles.map((vehicle) => (
                    <tr 
                      key={vehicle.id} 
                      className="hover:bg-gray-50 transition-colors duration-150 group"
                    >
                      {/* Vehicle Column with Image */}
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <VehicleImage vehicle={vehicle} size="sm" />
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-900 truncate" title={vehicle.make}>
                              {vehicle.make}
                            </div>
                            <div className="text-sm text-gray-500 truncate" title={`${vehicle.model} (${vehicle.year})`}>
                              {vehicle.model} ({vehicle.year})
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      {/* Status Column */}
                      <td className="px-3 py-4">
                        {getStatusDropdown(vehicle)}
                      </td>
                      
                      {/* Wash Status Column */}
                      <td className="px-3 py-4">
                        {getWashStatus(vehicle)}
                      </td>
                      
                      {/* Mileage Column */}
                      <td className="px-3 py-4">
                        <div className="text-sm font-medium text-gray-900">
                          {formatMileage(vehicle.current_mileage)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Updated: {formatDate(vehicle.last_mileage_update)}
                        </div>
                      </td>
                      
                      {/* Last Updated Column */}
                      <td className="px-3 py-4">
                        <div className="text-sm text-gray-600">
                          {formatDate(vehicle.wash_last_updated)}
                        </div>
                        <div className="text-xs text-gray-500">
                          Wash Status
                        </div>
                      </td>
                      
                      {/* Actions Column with Gas Calculator */}
                      <td className="px-3 py-4">
                        <div className="flex flex-col gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            icon={Eye} 
                            iconWeight="regular"
                            className="opacity-75 group-hover:opacity-100 transition-opacity text-xs justify-start"
                          >
                            View Details
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            icon={Calculator} 
                            iconWeight="regular"
                            onClick={() => openCalculator(vehicle)}
                            className="opacity-75 group-hover:opacity-100 transition-opacity text-xs justify-start"
                          >
                            Gas Calculator
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredVehicles.length)} of{' '}
              {filteredVehicles.length} vehicles
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
        
        {/* Gas Calculator Modal */}
        <GasCalculatorModal
          isOpen={calculatorModal.isOpen}
          onClose={closeCalculator}
          vehicle={calculatorModal.vehicle}
        />
    </div>
  )
}
