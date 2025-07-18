/*
 * Operations Application - Single Cohesive Fleet Management Software
 * All operati    { 
      id: 'settings', 
      label: 'Settings', 
      icon: User,
      iconWeight: 'regular'
    }
  ]

  // Administrative navigation items (separate section)
  const adminNavigationItems = [
    {
      id: 'admin',
      label: 'Admin Panel',
      icon: UserGear,
      iconWeight: 'regular' as const,
      route: '/admin'
    },
    {
      id: 'owner',
      label: 'Owner Portal',
      icon: Crown,
      iconWeight: 'fill' as const,
      route: '/owner'
    }
  ]ctionality in one unified interface
 */

import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { 
  ChartBar,
  Car,
  ClipboardText,
  User,
  SignOut,
  UserGear,
  Crown,
  Gear
} from 'phosphor-react'
import type { Icon } from 'phosphor-react'
import { supabase } from '../../src/lib/supabase'

// Import content components
import OperationsDashboard from './operations-dashboard'
import FleetPage from './operations.fleet'
import MaintenanceLogPage from './operations.maintenance'

interface NavigationItem {
  id: string
  label: string
  icon: Icon
  iconWeight: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'
}

type ActiveTab = 'dashboard' | 'fleet' | 'maintenance'

export default function OperationsApp() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard')

  // Handle URL parameters for tab switching
  useEffect(() => {
    const tabParam = searchParams.get('tab') as ActiveTab
    if (tabParam && ['dashboard', 'fleet', 'maintenance'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [searchParams])

  // Mock session - in production this would come from auth context
  const session = { 
    user: { 
      id: 'mock-user', 
      email: 'admin@rentagain.com',
      user_metadata: { full_name: 'Fleet Admin' },
      app_metadata: { 
        location_id: 'test-location-uuid',
        role: 'admin' // Can be 'owner', 'admin', 'employee'
      } 
    } 
  }

  // Sign out function
  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  // Navigation items for operations - NO PATHS, just tab switching
  const navigationItems: NavigationItem[] = [
    { 
      id: 'dashboard', 
      label: 'Operations Dashboard', 
      icon: ChartBar,
      iconWeight: 'regular'
    },
    { 
      id: 'fleet', 
      label: 'Fleet Management', 
      icon: Car,
      iconWeight: 'regular'
    },
    { 
      id: 'maintenance', 
      label: 'Maintenance Log', 
      icon: ClipboardText,
      iconWeight: 'regular'
    }
  ]

  // Administrative navigation items (separate section)
  const adminNavigationItems = [
    {
      id: 'admin',
      label: 'Admin Panel',
      icon: UserGear,
      iconWeight: 'regular' as const,
      route: '/admin'
    },
    {
      id: 'owner',
      label: 'Owner Portal',
      icon: Crown,
      iconWeight: 'fill' as const,
      route: '/owner'
    }
  ]

  // Render the appropriate content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <OperationsDashboard />
      case 'fleet':
        return <FleetPage />
      case 'maintenance':
        return <MaintenanceLogPage />
      default:
        return <OperationsDashboard />
    }
  }

  const user = session?.user
  const userLocationId = user?.app_metadata?.location_id
  const isOwner = user?.app_metadata?.role === 'owner' // Check if user is owner
  
  // Location state management
  const [selectedLocationId, setSelectedLocationId] = useState<string>(userLocationId || '')
  const [locations] = useState([
    { id: 'test-location-uuid', name: 'Downtown Showroom' },
    { id: 'loc2', name: 'Airport Branch' },
    { id: 'loc3', name: 'Beverly Hills' },
    { id: 'loc4', name: 'Santa Monica' }
  ])

  // Handle location change
  const handleLocationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLocationId(event.target.value)
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Persistent Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        {/* Logo/Brand Header */}
        <div className="p-6 border-b border-gray-200">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer group"
          >
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center group-hover:bg-blue-700 transition-colors">
              <Car size={24} weight="bold" className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">RentAgain</h1>
              <p className="text-sm text-gray-600">Fleet Operations</p>
            </div>
          </button>
        </div>

        {/* Location Selector */}
        <div className="px-6 py-3 border-b border-gray-200">
          <div className="relative">
            <select 
              value={selectedLocationId}
              onChange={handleLocationChange}
              className="appearance-none w-full bg-gray-50 border border-gray-300 rounded-md px-3 py-2 pr-8 text-sm text-gray-700 shadow-sm hover:border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors"
            >
              {isOwner && <option value="">All Locations</option>}
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

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navigationItems.map((item) => {
            const isActive = activeTab === item.id
            const IconComponent = item.icon
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as ActiveTab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <IconComponent 
                  size={20} 
                  weight={isActive ? 'bold' : item.iconWeight}
                  className={isActive ? 'text-blue-600' : 'text-gray-500'}
                />
                <span className={`font-medium ${isActive ? 'text-blue-700' : ''}`}>
                  {item.label}
                </span>
              </button>
            )
          })}

          {/* Administrative Section */}
          <div className="pt-4 mt-4 border-t border-gray-200">
            <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Administration
            </p>
            {adminNavigationItems.map((item) => {
              const IconComponent = item.icon
              
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.route)}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-150 text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                >
                  <IconComponent 
                    size={20} 
                    weight={item.iconWeight}
                    className={item.id === 'owner' ? 'text-amber-500' : 'text-gray-500'}
                  />
                  <span className="font-medium">{item.label}</span>
                  {item.id === 'owner' && (
                    <div className="ml-auto">
                      <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {user?.user_metadata?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}
                </p>
                <button
                  onClick={() => navigate('/operations/settings')}
                  className="flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-200 transition-colors group"
                  title="Settings"
                >
                  <Gear 
                    size={14} 
                    weight="regular" 
                    className="text-gray-500 group-hover:text-gray-700" 
                  />
                </button>
              </div>
              <p className="text-xs text-gray-500 truncate">
                Fleet Operations
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100 transition-all duration-150 text-sm"
          >
            <SignOut size={16} weight="regular" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Content switches based on active tab - NO routing */}
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  )
}
