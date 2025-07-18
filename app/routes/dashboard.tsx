import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { createClient } from '@supabase/supabase-js'
import { 
  Activity, 
  ArrowRight, 
  Clock, 
  MessageSquare, 
  Truck, 
  Wrench 
} from 'lucide-react'
import Sidebar from '../../src/components/OperationsSidebar'
import DashboardCalendar from '../../src/components/dashboard/DashboardCalendar'

// Modern Supabase client - NO deprecated auth helpers
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

/**
 * Operations Dashboard - MODERN SUPABASE 2024/2025 PATTERN
 * ✅ Uses @supabase/supabase-js directly (NO deprecated helpers)
 * ✅ Session management with onAuthStateChange
 * ✅ app_metadata.location_id for tenant isolation (secure)
 * ✅ Explicit location_id filters for performance
 * ✅ Proper RLS with auth.location_id() helper function
 */

interface FleetStats {
  totalVehicles: number
  availableVehicles: number
  inUseVehicles: number
  maintenanceVehicles: number
}

interface ChatMessage {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
}

interface MaintenanceTask {
  id: string
  vehicle_make: string
  vehicle_model: string
  vehicle_license_plate: string
  maintenance_type: 'routine' | 'emergency' | 'preventive' | 'inspection'
  work_performed: string
  date: string
  technician: string
  status?: 'scheduled' | 'in_progress' | 'completed'
}

interface LiveFeedItem {
  id: string
  type: 'vehicle' | 'task' | 'booking' | 'user'
  description: string
  timestamp: string
}

const OperationsDashboard: React.FC = () => {
  const navigate = useNavigate()
  
  // Modern session management - NO custom auth context
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isAiTyping, setIsAiTyping] = useState(false)
  const [liveFeed, setLiveFeed] = useState<LiveFeedItem[]>([])
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>([])
  const [fleetStats, setFleetStats] = useState<FleetStats>({
    totalVehicles: 0,
    availableVehicles: 0,
    inUseVehicles: 0,
    maintenanceVehicles: 0
  })
  const [companyName, setCompanyName] = useState<string>('Your Organization')
  const [currentPage, setCurrentPage] = useState('dashboard')

  // Modern session management pattern from the guide
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes - built-in Supabase feature
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Get location_id from app_metadata (secure, admin-only)
  const userLocationId = session?.user?.app_metadata?.location_id

  // Fetch company data with explicit location filter for performance
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!userLocationId || !session) return

      try {
        // CRITICAL: Always include explicit location_id filter for performance
        const { data, error } = await supabase
          .from('companies')
          .select('name')
          .eq('location_id', userLocationId) // Explicit filter for performance
          .single()

        if (error) {
          console.error('Error fetching company:', error)
          return
        }

        if (data) {
          setCompanyName(data.name)
        }
      } catch (error) {
        console.error('Company fetch error:', error)
      }
    }

    fetchCompanyData()
  }, [userLocationId, session])

  // Fetch vehicles with explicit location filter for performance
  useEffect(() => {
    const fetchVehicleData = async () => {
      if (!userLocationId || !session) {
        setLoading(false)
        return
      }

      try {
        // CRITICAL: Always include explicit location_id filter for performance
        // RLS policies provide security, explicit filters provide performance
        const { data: vehicles, error } = await supabase
          .from('vehicles')
          .select('id, make, model, status, updated_at')
          .eq('location_id', userLocationId) // Explicit filter for performance

        if (error) {
          console.error('Error fetching vehicles:', error)
          return
        }

        // Calculate fleet statistics
        const stats = vehicles.reduce((acc, vehicle) => {
          acc.totalVehicles++
          switch (vehicle.status) {
            case 'available':
              acc.availableVehicles++
              break
            case 'rented':
              acc.inUseVehicles++
              break
            case 'maintenance':
              acc.maintenanceVehicles++
              break
          }
          return acc
        }, {
          totalVehicles: 0,
          availableVehicles: 0,
          inUseVehicles: 0,
          maintenanceVehicles: 0
        })

        setFleetStats(stats)

        // Generate live feed from recent vehicle updates
        const sortedVehicles = [...vehicles].sort(
          (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        )

        const feedItems: LiveFeedItem[] = sortedVehicles.slice(0, 10).map((vehicle) => ({
          id: `vehicle-${vehicle.id}`,
          type: 'vehicle' as const,
          description: `${vehicle.make} ${vehicle.model} status changed to ${vehicle.status}`,
          timestamp: vehicle.updated_at,
        }))

        setLiveFeed(feedItems)
      } catch (error) {
        console.error('Vehicle fetch error:', error)
      }
    }

    fetchVehicleData()
  }, [userLocationId, session])

  // Fetch maintenance tasks with explicit location filter for performance
  useEffect(() => {
    const fetchMaintenanceData = async () => {
      if (!userLocationId || !session) {
        return
      }

      try {
        // Mock maintenance tasks for now - replace with actual Supabase query
        const mockMaintenanceTasks: MaintenanceTask[] = [
          {
            id: 'maint-1',
            vehicle_make: 'Ford',
            vehicle_model: 'Transit',
            vehicle_license_plate: 'ABC-123',
            maintenance_type: 'routine',
            work_performed: 'Oil change and tire rotation',
            date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            technician: 'John Smith',
            status: 'scheduled'
          },
          {
            id: 'maint-2',
            vehicle_make: 'Chevrolet',
            vehicle_model: 'Express',
            vehicle_license_plate: 'DEF-456',
            maintenance_type: 'inspection',
            work_performed: 'Annual safety inspection',
            date: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
            technician: 'Jane Doe',
            status: 'scheduled'
          },
          {
            id: 'maint-3',
            vehicle_make: 'Ford',
            vehicle_model: 'F-150',
            vehicle_license_plate: 'GHI-789',
            maintenance_type: 'emergency',
            work_performed: 'Engine diagnostics and repair',
            date: new Date().toISOString(), // Today
            technician: 'Mike Johnson',
            status: 'in_progress'
          }
        ]

        setMaintenanceTasks(mockMaintenanceTasks)

        // Production implementation will fetch from maintenance_entries table
        // with proper location_id filtering for multi-tenant security

      } catch (error) {
        console.error('Maintenance fetch error:', error)
      }
    }

    fetchMaintenanceData()
  }, [userLocationId, session])

  // Navigation handlers for fleet overview cards
  const handleFleetCardClick = (filterType: string) => {
    const statusMap: Record<string, string> = {
      total: 'all',
      available: 'available',
      inUse: 'rented',
      maintenance: 'maintenance',
    }

    const status = statusMap[filterType] || 'all'
    navigate(`/fleet?status=${status}`)
  }

  // Simple chat handler (replace with your AI service)
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isAiTyping) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      text: inputMessage.trim(),
      isUser: true,
      timestamp: new Date(),
    }

    setChatMessages((prev) => [...prev, userMessage])
    setInputMessage('')
    setIsAiTyping(true)

    // Simulate AI response (replace with actual AI service)
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        text: `I can help you with your fleet of ${fleetStats.totalVehicles} vehicles. What would you like to know?`,
        isUser: false,
        timestamp: new Date(),
      }
      setChatMessages((prev) => [...prev, aiMessage])
      setIsAiTyping(false)
    }, 1000)
  }

  const handlePageChange = (page: string) => {
    setCurrentPage(page)
    // Navigate to different routes based on page
    switch (page) {
      case 'fleet':
        navigate('/fleet')
        break
      case 'task-board':
        navigate('/tasks')
        break
      case 'profile':
        navigate('/profile')
        break
      default:
        navigate('/dashboard')
    }
  }

  const handleMaintenanceTaskClick = (taskId: string) => {
    // Navigate to maintenance page with specific task highlighted
    navigate(`/operations?tab=maintenance&task=${taskId}`)
  }

  // Loading state while checking session
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  // Redirect to auth if no session
  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Please log in to access the dashboard</div>
      </div>
    )
  }

  // Check for location assignment in app_metadata
  if (!userLocationId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Error: No location assigned to user in app_metadata</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar with session passed as prop */}
      <Sidebar 
        currentPage={currentPage} 
        onPageChange={handlePageChange}
        session={session}
      />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Operations Dashboard</h1>
              <p className="text-gray-600">
                Fleet overview for {companyName}
              </p>
              <p className="text-xs text-gray-500">
                Location: {userLocationId} | User: {session.user.email}
              </p>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>

          {/* Fleet Overview */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Truck className="h-5 w-5 mr-2" />
              Fleet Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <button
                onClick={() => handleFleetCardClick('total')}
                className="text-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="text-2xl font-bold text-blue-600">{fleetStats.totalVehicles}</div>
                <div className="text-sm text-gray-600">Total Vehicles</div>
              </button>
              <button
                onClick={() => handleFleetCardClick('available')}
                className="text-center p-4 bg-green-50 rounded-lg hover:bg-green-100 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="text-2xl font-bold text-green-600">{fleetStats.availableVehicles}</div>
                <div className="text-sm text-gray-600">Available</div>
              </button>
              <button
                onClick={() => handleFleetCardClick('inUse')}
                className="text-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="text-2xl font-bold text-purple-600">{fleetStats.inUseVehicles}</div>
                <div className="text-sm text-gray-600">In Use</div>
              </button>
              <button
                onClick={() => handleFleetCardClick('maintenance')}
                className="text-center p-4 bg-yellow-50 rounded-lg hover:bg-yellow-100 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="text-2xl font-bold text-yellow-600">
                  {fleetStats.maintenanceVehicles}
                </div>
                <div className="text-sm text-gray-600">Maintenance</div>
              </button>
            </div>
          </div>

          {/* Quick Fleet Management Access */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="text-center">
              <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fleet Management</h3>
              <p className="text-gray-600 mb-4">
                Access comprehensive fleet management tools
              </p>
              <button
                onClick={() => navigate('/fleet')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center mx-auto"
              >
                Open Fleet Manager
                <ArrowRight className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar Component - Left Side */}
            <div className="order-1">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Calendar</h3>
                <DashboardCalendar
                  maintenanceTasks={maintenanceTasks}
                  onMaintenanceClick={handleMaintenanceTaskClick}
                  className="h-[500px]"
                />
              </div>
            </div>

            {/* Right Column - Fleet Assistant and Live Feed */}
            <div className="order-2 space-y-6">
              {/* Fleet Assistant Chat */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                    Fleet Assistant
                  </h3>
                </div>
                <div className="p-4">
                  <div className="h-48 overflow-y-auto mb-4 space-y-3">
                    {chatMessages.length === 0 ? (
                      <div className="text-center text-gray-500 py-6">
                        <MessageSquare className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">Ask me anything about your fleet!</p>
                      </div>
                    ) : (
                      chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                              message.isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                            }`}
                          >
                            {message.text}
                          </div>
                        </div>
                      ))
                    )}
                    {isAiTyping && (
                      <div className="flex justify-start">
                        <div className="bg-gray-100 px-3 py-2 rounded-lg">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: '0.1s' }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                              style={{ animationDelay: '0.2s' }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask about your fleet..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      disabled={isAiTyping}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isAiTyping}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Live Feed */}
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-green-600" />
                    Live Activity Feed
                  </h3>
                </div>
                <div className="p-4">
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {liveFeed.length === 0 ? (
                      <div className="text-center text-gray-500 py-6">
                        <Clock className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm">No recent activity</p>
                      </div>
                    ) : (
                      liveFeed.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded"
                        >
                          <div className="flex-shrink-0 mt-1">
                            {item.type === 'vehicle' && <Truck className="h-4 w-4 text-blue-600" />}
                            {item.type === 'task' && <Wrench className="h-4 w-4 text-orange-600" />}
                            {item.type === 'booking' && <Clock className="h-4 w-4 text-green-600" />}
                            {item.type === 'user' && (
                              <MessageSquare className="h-4 w-4 text-purple-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-900">{item.description}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(item.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OperationsDashboard