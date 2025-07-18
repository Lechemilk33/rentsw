import React, { useEffect, useState } from 'react'
import {
  BarChart3,
  Car,
  CheckSquare,
  User,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'

// Modern Supabase client - same pattern as other components
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

interface SidebarProps {
  currentPage: string
  onPageChange: (page: string) => void
  session: any // Modern session object from Supabase
}

interface NavigationItem {
  id: string
  label: string
  icon: LucideIcon
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange, session }) => {
  // Get user from modern session object (no deprecated hooks)
  const user = session?.user
  const userLocationId = user?.app_metadata?.location_id

  // State for dynamic company branding
  const [companyName, setCompanyName] = useState<string>('Loading...')
  const [loading, setLoading] = useState(true)
  
  // Location selection state
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(userLocationId || null)
  const [locations, setLocations] = useState<Array<{ id: string; name: string }>>([])

  // Fetch company data based on user's location_id
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!userLocationId || !session) return

      try {
        // RLS will automatically filter to user's location
        const { data, error } = await supabase
          .from('locations')
          .select('company_name')
          .eq('id', userLocationId)
          .single()

        if (error) {
          console.error('Error fetching company data:', error)
          setCompanyName('Fleet Management') // Fallback
        } else {
          setCompanyName(data.company_name || 'Fleet Management')
        }
      } catch (err) {
        console.error('Error fetching company data:', err)
        setCompanyName('Fleet Management') // Fallback
      } finally {
        setLoading(false)
      }
    }

    fetchCompanyData()
  }, [userLocationId, session])

  // Fetch available locations for dropdown
  useEffect(() => {
    const fetchLocations = async () => {
      if (!session) return

      try {
        // Fetch all locations the user has access to
        const { data, error } = await supabase
          .from('locations')
          .select('id, name')
          .order('name')

        if (error) {
          console.error('Error fetching locations:', error)
          // Fallback to mock locations
          setLocations([
            { id: 'loc1', name: 'Downtown Showroom' },
            { id: 'loc2', name: 'Airport Branch' },
            { id: 'loc3', name: 'Beverly Hills' },
            { id: 'loc4', name: 'Santa Monica' }
          ])
        } else {
          setLocations(data || [])
        }
      } catch (err) {
        console.error('Error fetching locations:', err)
        // Fallback to mock locations
        setLocations([
          { id: 'loc1', name: 'Downtown Showroom' },
          { id: 'loc2', name: 'Airport Branch' },
          { id: 'loc3', name: 'Beverly Hills' },
          { id: 'loc4', name: 'Santa Monica' }
        ])
      }
    }

    fetchLocations()
  }, [session])

  // Handle location change
  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const locationId = event.target.value || null
    setSelectedLocationId(locationId)
    // You can add additional logic here to refresh data or navigate
  }

  // Simple navigation - Supabase RLS handles all permissions automatically
  const navigationItems: NavigationItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'fleet', label: 'Fleet Management', icon: Car },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'settings', label: 'Settings', icon: User },
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Logo/Brand - Dynamic company name from Supabase */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">
          {loading ? (
            <div className="animate-pulse bg-gray-200 h-8 w-32 rounded"></div>
          ) : (
            companyName
          )}
        </h1>
        <p className="text-sm text-gray-600">Fleet Operations</p>
        
        {/* Location Selector */}
        <div className="mt-3">
          <label className="block text-xs font-medium text-gray-500 mb-1">Location</label>
          <div className="relative">
            <select 
              value={selectedLocationId || ''}
              onChange={handleLocationChange}
              className="appearance-none w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm text-gray-700 shadow-sm hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
            >
              <option value="">All Locations</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
            {/* Dropdown indicator */}
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Simple Navigation - RLS handles all permissions */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
              currentPage === item.id
                ? 'bg-blue-50 text-blue-600 border border-blue-200'
                : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-medium">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.app_metadata?.location_id || 'Location'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
