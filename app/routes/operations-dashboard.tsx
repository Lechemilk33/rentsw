import React, { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import FleetOverviewCards from '../../src/components/FleetOverviewCards'
import DashboardCalendar from '../../src/components/dashboard/DashboardCalendar'
import { LiveUpdateFeed } from '../../src/components/dashboard/LiveUpdateFeed'
import { Loading } from '../../src/components/ui'

// Modern Supabase client - same pattern as other components
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

/**
 * Operations Dashboard - Main Route Component
 * 
 * Central hub for fleet management operations with:
 * - Fleet overview cards with real-time stats
 * - AI chat window for assistance 
 * - Recent updates activity feed
 * - Navigation sidebar
 * 
 * Uses modern Supabase patterns with RLS for multi-tenant isolation.
 * All data fetching handled by child components for modularity.
 */
export default function OperationsDashboard() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Modern session management - temporarily bypassed for development
  useEffect(() => {
    // Skip auth for now - just set a mock session
    setSession({ user: { id: 'mock-user', app_metadata: { location_id: 'test-location-uuid' } } })
    setLoading(false)
  }, [])

  // Show loading state
  if (loading) {
    return (
      <Loading 
        size="lg" 
        text="Loading Operations Dashboard..." 
        fullScreen 
      />
    )
  }

  return (
    /* Dashboard Content Only - No Sidebar (handled by parent) */
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Operations Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Monitor your fleet, manage operations, and stay updated with real-time insights.
        </p>
      </div>

      {/* Fleet Overview Cards */}
      <FleetOverviewCards session={session} />

      {/* Dashboard Calendar with Live Feed - 70/30 Split */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 max-w-7xl">
        {/* Calendar - 70% */}
        <div className="lg:col-span-7">
          <DashboardCalendar />
        </div>
        
        {/* Live Updates Feed - 30% */}
        <div className="lg:col-span-3">
          <LiveUpdateFeed />
        </div>
      </div>
  </div>
  )
}
