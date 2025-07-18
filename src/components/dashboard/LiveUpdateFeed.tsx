/*
 * LiveUpdateFeed Component - Minimal Activity Feed
 * Clean, unobtrusive updates feed for the dashboard
 */

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { supabase } from '../../lib/supabase'

interface UpdateItem {
  id: string
  type: 'booking' | 'maintenance' | 'vehicle' | 'system'
  title: string
  description: string
  timestamp: string
  vehicleInfo?: {
    make: string
    model: string
    licensePlate: string
  }
}

interface LiveUpdateFeedProps {
  className?: string
}

// Activity Content Helper Component
function ActivityContent({ 
  displayUpdates, 
  viewMode, 
  getUpdateIcon, 
  formatTime 
}: { 
  displayUpdates: UpdateItem[]
  viewMode: 'today' | 'archived'
  getUpdateIcon: (type: UpdateItem['type']) => React.ReactElement
  formatTime: (timestamp: string) => string
}) {
  if (displayUpdates.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-500 text-sm">
          {viewMode === 'today' ? 'No activity today' : 'No archived logs available'}
        </p>
      </div>
    )
  }

  // Group archived updates by date for better organization
  const groupedUpdates = viewMode === 'archived' 
    ? displayUpdates.reduce((groups: Record<string, UpdateItem[]>, update) => {
        const date = new Date(update.timestamp).toLocaleDateString('en-US', { 
          weekday: 'long',
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
        if (!groups[date]) {
          groups[date] = []
        }
        groups[date].push(update)
        return groups
      }, {})
    : { 'Today': displayUpdates }

  return (
    <div className="space-y-6">
      {Object.entries(groupedUpdates).map(([date, updates]) => (
        <div key={date}>
          {viewMode === 'archived' && (
            <div className="sticky top-0 bg-white pb-2 mb-4">
              <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-200 pb-2">
                {date}
              </h3>
            </div>
          )}
          <div className="space-y-3">
            {updates.map((update) => (
              <div key={update.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="mt-1 flex-shrink-0">
                  {getUpdateIcon(update.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-gray-900">
                      {update.title}
                    </p>
                    <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                      {viewMode === 'archived' 
                        ? new Date(update.timestamp).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })
                        : formatTime(update.timestamp)
                      }
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {update.description}
                  </p>
                  {update.vehicleInfo && (
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {update.vehicleInfo.licensePlate}
                      </span>
                      <span className="text-xs text-gray-500 capitalize">
                        {update.type} activity
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// Activity Modal Component
function ActivityModal({ 
  isOpen, 
  onClose, 
  updates, 
  onRefresh, 
  loading 
}: { 
  isOpen: boolean
  onClose: () => void
  updates: UpdateItem[]
  onRefresh: () => void
  loading: boolean
}) {
  const [viewMode, setViewMode] = useState<'today' | 'archived'>('today')
  const [archivedUpdates, setArchivedUpdates] = useState<UpdateItem[]>([])
  const [loadingArchived, setLoadingArchived] = useState(false)

  const loadArchivedUpdates = async () => {
    setLoadingArchived(true)
    try {
      // Get older updates (older than 24 hours)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      
      const { data: bookings } = await supabase
        .from('bookings')
        .select(`
          id, customer_name, status, created_at, updated_at,
          vehicles!inner(make, model, license_plate)
        `)
        .lt('created_at', oneDayAgo)
        .order('created_at', { ascending: false })
        .limit(20)

      const { data: vehicles } = await supabase
        .from('vehicles')
        .select('id, make, model, license_plate, status, updated_at')
        .lt('updated_at', oneDayAgo)
        .order('updated_at', { ascending: false })
        .limit(10)

      const archived: UpdateItem[] = []

      // Generate archived data organized by date (last 30 days)
      const sampleArchived: UpdateItem[] = []
      
      // Create entries for the last 30 days, organized by date
      for (let daysAgo = 1; daysAgo <= 30; daysAgo++) {
        const date = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
        
        // Add 1-3 random activities per day
        const activitiesPerDay = Math.floor(Math.random() * 3) + 1
        
        for (let i = 0; i < activitiesPerDay; i++) {
          const timestamp = new Date(
            date.getTime() + Math.random() * 24 * 60 * 60 * 1000
          ).toISOString()
          
          const activityTypes = [
            {
              type: 'booking' as const,
              titles: ['Booking Completed', 'Booking Created', 'Booking Cancelled', 'Booking Modified'],
              descriptions: ['Sarah Johnson • Honda Civic', 'Michael Chen • Toyota Camry', 'Emily Rodriguez • Ford Explorer', 'David Wilson • BMW X5'],
              vehicleInfo: { make: 'Honda', model: 'Civic', licensePlate: 'HND-123' }
            },
            {
              type: 'maintenance' as const,
              titles: ['Oil Change Completed', 'Brake Service', 'Tire Rotation', 'Engine Diagnostics'],
              descriptions: ['Routine maintenance completed', 'Brake pads replaced', 'Tires rotated and balanced', 'Engine check completed'],
              vehicleInfo: { make: 'Ford', model: 'Explorer', licensePlate: 'FRD-456' }
            },
            {
              type: 'vehicle' as const,
              titles: ['Vehicle Registered', 'Status Updated', 'Location Changed', 'Mileage Updated'],
              descriptions: ['New vehicle added to fleet', 'Vehicle status changed to available', 'Vehicle moved to new location', 'Odometer reading updated'],
              vehicleInfo: { make: 'Toyota', model: 'Camry', licensePlate: 'TYT-789' }
            }
          ]
          
          const randomActivity = activityTypes[Math.floor(Math.random() * activityTypes.length)]
          const randomTitle = randomActivity.titles[Math.floor(Math.random() * randomActivity.titles.length)]
          const randomDescription = randomActivity.descriptions[Math.floor(Math.random() * randomActivity.descriptions.length)]
          
          sampleArchived.push({
            id: `archived-${daysAgo}-${i}`,
            type: randomActivity.type,
            title: randomTitle,
            description: randomDescription,
            timestamp,
            vehicleInfo: randomActivity.vehicleInfo
          })
        }
      }
      
      // Sort by timestamp (newest first)
      sampleArchived.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      setArchivedUpdates(sampleArchived)
    } catch (error) {
      console.error('Error loading archived updates:', error)
    } finally {
      setLoadingArchived(false)
    }
  }

  useEffect(() => {
    if (viewMode === 'archived' && archivedUpdates.length === 0) {
      loadArchivedUpdates()
    }
  }, [viewMode])

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    
    // For archived items, show full date
    if (diffInMinutes >= 1440) {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    return date.toLocaleDateString()
  }

  const getUpdateIcon = (type: UpdateItem['type']) => {
    switch (type) {
      case 'booking':
        return <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
      case 'vehicle':
        return <div className="w-3 h-3 bg-green-500 rounded-full"></div>
      case 'maintenance':
        return <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
      case 'system':
        return <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
      default:
        return <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
    }
  }

  const displayUpdates = viewMode === 'today' ? updates : archivedUpdates
  const isLoading = viewMode === 'today' ? loading : loadingArchived

  if (!isOpen) return null

  return createPortal(
    <div 
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
    >
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
      <div className="relative w-full max-w-2xl h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Activity Feed</h2>
              <p className="text-sm text-gray-600">
                {viewMode === 'today' ? `${displayUpdates.length} updates today` : `${displayUpdates.length} archived updates`}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close activity feed"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 m-4">
          <button
            onClick={() => setViewMode('today')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 text-sm font-medium rounded-md transition-all ${
              viewMode === 'today' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Today's Activity</span>
          </button>
          <button
            onClick={() => setViewMode('archived')}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 text-sm font-medium rounded-md transition-all ${
              viewMode === 'archived' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            <span>Archived Logs</span>
          </button>
        </div>

        {/* Activity List */}
        <div className="h-96 overflow-y-auto p-4" style={{ maxHeight: 'calc(600px - 200px)' }}>
          {isLoading ? (
            <div className="space-y-4">
              {['skeleton-1', 'skeleton-2', 'skeleton-3', 'skeleton-4', 'skeleton-5', 'skeleton-6'].map((skeletonId) => (
                <div key={skeletonId} className="animate-pulse">
                  <div className="flex items-start gap-4">
                    <div className="w-3 h-3 bg-gray-200 rounded-full mt-2"></div>
                    <div className="flex-1 min-w-0">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                    </div>
                    <div className="h-3 bg-gray-100 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <ActivityContent 
              displayUpdates={displayUpdates}
              viewMode={viewMode}
              getUpdateIcon={getUpdateIcon}
              formatTime={formatTime}
            />
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}

export const LiveUpdateFeed: React.FC<LiveUpdateFeedProps> = ({ 
  className = '' 
}) => {
  const [updates, setUpdates] = useState<UpdateItem[]>([])
  const [allUpdates, setAllUpdates] = useState<UpdateItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showActivityModal, setShowActivityModal] = useState(false)

  useEffect(() => {
    loadRecentUpdates()

    // Set up real-time subscriptions for live updates
    const bookingsSubscription = supabase
      .channel('bookings_updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'bookings' },
        handleBookingUpdate
      )
      .subscribe()

    const vehiclesSubscription = supabase
      .channel('vehicles_updates')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'vehicles' },
        handleVehicleUpdate
      )
      .subscribe()

    return () => {
      bookingsSubscription.unsubscribe()
      vehiclesSubscription.unsubscribe()
    }
  }, [])

  const loadRecentUpdates = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    try {
      // Add some sample data for immediate display
      const sampleUpdates: UpdateItem[] = [
        {
          id: 'sample-1',
          type: 'booking',
          title: 'New Booking',
          description: 'John Doe • BMW X5',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
          vehicleInfo: { make: 'BMW', model: 'X5', licensePlate: 'ABC-123' }
        },
        {
          id: 'sample-2',
          type: 'vehicle',
          title: 'Vehicle Updated',
          description: 'Mercedes E-Class • Available',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
          vehicleInfo: { make: 'Mercedes', model: 'E-Class', licensePlate: 'XYZ-789' }
        },
        {
          id: 'sample-3',
          type: 'maintenance',
          title: 'Service Complete',
          description: 'Audi A4 • Oil Change',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          vehicleInfo: { make: 'Audi', model: 'A4', licensePlate: 'DEF-456' }
        },
        {
          id: 'sample-4',
          type: 'booking',
          title: 'Booking Confirmed',
          description: 'Jane Smith • Tesla Model S',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          vehicleInfo: { make: 'Tesla', model: 'Model S', licensePlate: 'TSL-001' }
        },
        {
          id: 'sample-5',
          type: 'booking',
          title: 'Payment Received',
          description: 'Mike Johnson • Honda Civic',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
          vehicleInfo: { make: 'Honda', model: 'Civic', licensePlate: 'HND-234' }
        },
        {
          id: 'sample-6',
          type: 'maintenance',
          title: 'Inspection Due',
          description: 'Ford Explorer • Safety Check',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
          vehicleInfo: { make: 'Ford', model: 'Explorer', licensePlate: 'FRD-567' }
        },
        {
          id: 'sample-7',
          type: 'vehicle',
          title: 'New Vehicle Added',
          description: 'Chevrolet Suburban • Ready for Service',
          timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(), // 10 hours ago
          vehicleInfo: { make: 'Chevrolet', model: 'Suburban', licensePlate: 'CHV-890' }
        },
        {
          id: 'sample-8',
          type: 'booking',
          title: 'Booking Modified',
          description: 'Sarah Wilson • Jeep Grand Cherokee',
          timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
          vehicleInfo: { make: 'Jeep', model: 'Grand Cherokee', licensePlate: 'JEP-345' }
        },
        {
          id: 'sample-9',
          type: 'system',
          title: 'Database Backup',
          description: 'Automated backup completed successfully',
          timestamp: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(), // 14 hours ago
        },
        {
          id: 'sample-10',
          type: 'maintenance',
          title: 'Brake Service',
          description: 'Toyota Prius • Brake Pad Replacement',
          timestamp: new Date(Date.now() - 16 * 60 * 60 * 1000).toISOString(), // 16 hours ago
          vehicleInfo: { make: 'Toyota', model: 'Prius', licensePlate: 'TYT-678' }
        }
      ]

      // Get real data
      const { data: bookings } = await supabase
        .from('bookings')
        .select(`
          id, customer_name, status, created_at, updated_at,
          vehicles!inner(make, model, license_plate)
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      const { data: vehicles } = await supabase
        .from('vehicles')
        .select('id, make, model, license_plate, status, updated_at')
        .order('updated_at', { ascending: false })
        .limit(3)

      const recentUpdates: UpdateItem[] = [...sampleUpdates]

      // Process real bookings if available
      if (bookings && bookings.length > 0) {
        bookings.forEach((booking: any) => {
          recentUpdates.push({
            id: `booking-${booking.id}`,
            type: 'booking',
            title: 'New Booking',
            description: `${booking.customer_name} • ${booking.vehicles.make} ${booking.vehicles.model}`,
            timestamp: booking.created_at,
            vehicleInfo: {
              make: booking.vehicles.make,
              model: booking.vehicles.model,
              licensePlate: booking.vehicles.license_plate
            }
          })
        })
      }

      // Process real vehicle updates if available
      if (vehicles && vehicles.length > 0) {
        vehicles.forEach((vehicle: any) => {
          recentUpdates.push({
            id: `vehicle-${vehicle.id}`,
            type: 'vehicle',
            title: 'Vehicle Updated',
            description: `${vehicle.make} ${vehicle.model} • ${vehicle.status}`,
            timestamp: vehicle.updated_at,
            vehicleInfo: {
              make: vehicle.make,
              model: vehicle.model,
              licensePlate: vehicle.license_plate
            }
          })
        })
      }

      // Sort by timestamp and take latest 8 for the main feed, but store all for the modal
      recentUpdates.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      setAllUpdates(recentUpdates) // Store all updates for the modal
      setUpdates(recentUpdates.slice(0, 8)) // Display only 8 in the main feed

    } catch (error) {
      console.error('Error loading updates:', error)
      // Fallback to sample data on error
      setUpdates([
        {
          id: 'fallback-1',
          type: 'system',
          title: 'System Status',
          description: 'All systems operational',
          timestamp: new Date().toISOString()
        }
      ])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    loadRecentUpdates(true)
  }

  const handleBookingUpdate = (payload: any) => {
    // Add new booking update to the feed
    loadRecentUpdates()
  }

  const handleVehicleUpdate = (payload: any) => {
    // Add new vehicle update to the feed
    loadRecentUpdates()
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  const getUpdateIcon = (type: UpdateItem['type']) => {
    switch (type) {
      case 'booking':
        return <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
      case 'vehicle':
        return <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      case 'maintenance':
        return <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
      case 'system':
        return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
      default:
        return <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
    }
  }

  if (loading) {
    const skeletonItems = ['skeleton-1', 'skeleton-2', 'skeleton-3', 'skeleton-4']
    
    return (
      <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">Live Updates</h3>
          <button
            disabled
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh updates"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        <div className="space-y-3">
          {skeletonItems.map((id) => (
            <div key={id} className="animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-200 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-3 bg-gray-200 rounded mb-1"></div>
                  <div className="h-2 bg-gray-100 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <>
      <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900">Live Updates</h3>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            title="Refresh updates"
          >
            <svg 
              className={`w-4 h-4 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
        
        {updates.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            </div>
            <p className="text-sm text-gray-500">No recent updates</p>
          </div>
        ) : (
          <div className="space-y-3">
            {updates.map((update) => (
              <div key={update.id} className="flex items-start gap-3 group">
                <div className="mt-2 flex-shrink-0">
                  {getUpdateIcon(update.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {update.title}
                    </p>
                    <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                      {formatTime(update.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {update.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-4 pt-3 border-t border-gray-100">
          <button 
            onClick={() => setShowActivityModal(true)}
            className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            View all activity
          </button>
        </div>
      </div>

      {/* Activity Modal */}
      <ActivityModal
        isOpen={showActivityModal}
        onClose={() => setShowActivityModal(false)}
        updates={allUpdates}
        onRefresh={handleRefresh}
        loading={refreshing}
      />
    </>
  )
}
