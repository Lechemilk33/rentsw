import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { createClient } from '@supabase/supabase-js'
import { 
  Car, 
  Wrench, 
  ChartLine, 
  TrendUp
} from 'phosphor-react'

// Modern Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

interface FleetStats {
  available: number
  rented: number
  maintenance: number
  outOfService: number
  utilizationRate: number
  avgRentalDuration: number
  maintenanceScheduled: number
}

interface FleetOverviewCardsProps {
  session: any
}

/**
 * Minimal Fleet Overview Cards Component
 * Clean, professional dashboard cards with subtle design
 */
const FleetOverviewCards: React.FC<FleetOverviewCardsProps> = ({ session }) => {
  const navigate = useNavigate()
  const [fleetStats, setFleetStats] = useState<FleetStats>({
    available: 0,
    rented: 0,
    maintenance: 0,
    outOfService: 0,
    utilizationRate: 0,
    avgRentalDuration: 0,
    maintenanceScheduled: 0
  })
  const [loading, setLoading] = useState(true)

  const userLocationId = session?.user?.app_metadata?.location_id

  useEffect(() => {
    const fetchFleetStats = async () => {
      if (!userLocationId || !session) {
        // Enterprise placeholder data
        setFleetStats({
          available: 12,
          rented: 8,
          maintenance: 3,
          outOfService: 1,
          utilizationRate: 67.5,
          avgRentalDuration: 3.2,
          maintenanceScheduled: 2
        })
        setLoading(false)
        return
      }

      try {
        // Fetch real vehicle data when vehicles table exists
        const { data: vehicles, error } = await supabase
          .from('vehicles')
          .select('status, updated_at')
          .eq('location_id', userLocationId)

        if (error) {
          console.warn('Vehicles table not found, using placeholder data')
          throw error
        }

        const stats = vehicles.reduce((acc, vehicle) => {
          switch (vehicle.status) {
            case 'available':
              acc.available++
              break
            case 'rented':
              acc.rented++
              break
            case 'maintenance':
              acc.maintenance++
              break
            case 'out_of_service':
              acc.outOfService++
              break
          }
          return acc
        }, { available: 0, rented: 0, maintenance: 0, outOfService: 0 })

        const total = stats.available + stats.rented + stats.maintenance + stats.outOfService
        const utilizationRate = total > 0 ? (stats.rented / total) * 100 : 0

        setFleetStats({
          ...stats,
          utilizationRate,
          avgRentalDuration: 3.2, // Mock data - would come from rentals analysis
          maintenanceScheduled: 2 // Mock data - would come from maintenance schedule
        })
      } catch (error) {
        console.info('Using placeholder fleet data for development:', error)
        // Enterprise placeholder data for demonstration
        setFleetStats({
          available: 12,
          rented: 8,
          maintenance: 3,
          outOfService: 1,
          utilizationRate: 67.5,
          avgRentalDuration: 3.2,
          maintenanceScheduled: 2
        })
      } finally {
        setLoading(false)
      }
    }

    fetchFleetStats()
  }, [userLocationId, session])

  const handleCardClick = (status: string) => {
    // Navigate to operations fleet tab with status filter
    navigate(`/operations?tab=fleet&status=${status}`)
  }

  // Clean, minimal fleet cards
  const fleetCards = [
    {
      title: 'Fleet Utilization',
      primaryMetric: `${fleetStats.utilizationRate.toFixed(1)}%`,
      secondaryMetric: `${fleetStats.rented} of ${fleetStats.available + fleetStats.rented} vehicles`,
      icon: ChartLine,
      dotColor: 'bg-blue-500',
      target: 'fleet'
    },
    {
      title: 'Available',
      primaryMetric: fleetStats.available.toString(),
      secondaryMetric: 'Ready to rent',
      icon: Car,
      dotColor: 'bg-green-500',
      target: 'available'
    },
    {
      title: 'Active Rentals',
      primaryMetric: fleetStats.rented.toString(),
      secondaryMetric: `Average ${fleetStats.avgRentalDuration} days`,
      icon: TrendUp,
      dotColor: 'bg-blue-500',
      target: 'rented'
    },
    {
      title: 'Maintenance',
      primaryMetric: fleetStats.maintenance.toString(),
      secondaryMetric: `${fleetStats.maintenanceScheduled} scheduled`,
      icon: Wrench,
      dotColor: 'bg-amber-500',
      target: 'maintenance'
    }
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-20 h-4 bg-gray-200 rounded"></div>
              <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
            </div>
            <div className="w-16 h-8 bg-gray-200 rounded mb-2"></div>
            <div className="w-24 h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {fleetCards.map((card) => (
        <button
          key={card.target}
          type="button"
          className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-sm transition-all duration-200 text-left w-full"
          onClick={() => handleCardClick(card.target)}
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">{card.title}</span>
            <div className={`w-2 h-2 ${card.dotColor} rounded-full`}></div>
          </div>
          
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-gray-900">
              {card.primaryMetric}
            </div>
            <div className="text-sm text-gray-500">
              {card.secondaryMetric}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}


export default FleetOverviewCards
