/*
 * Vehicle Maintenance History Modal - Professional vehicle-specific maintenance tracking
 * Shows complete maintenance timeline for a single vehicle
 */

import React, { useState, useEffect } from 'react'
import { 
  X,
  Car,
  Wrench,
  Calendar,
  User,
  Timer,
  CurrencyDollar,
  Gauge,
  ClipboardText,
  Plus,
  Download,
  TrendUp,
  Warning
} from 'phosphor-react'
import { Button, Card, Badge } from '../ui'
import type { MaintenanceEntry } from './types'

interface VehicleMaintenanceModalProps {
  isOpen: boolean
  onClose: () => void
  vehicle: {
    id: string
    make: string
    model: string
    year: number
    license_plate: string
    current_mileage: number
  } | null
  maintenanceEntries?: MaintenanceEntry[]
  onAddNewEntry?: (vehicleId: string) => void
}

interface MaintenanceStats {
  totalEntries: number
  totalCost: number
  lastServiceDate: string | null
  nextServiceDue: string | null
  averageServiceInterval: number
}

export const VehicleMaintenanceModal: React.FC<VehicleMaintenanceModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  maintenanceEntries = [],
  onAddNewEntry
}) => {
  const [entries, setEntries] = useState<MaintenanceEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<MaintenanceStats | null>(null)

  useEffect(() => {
    if (isOpen && vehicle) {
      if (maintenanceEntries.length > 0) {
        // Use provided maintenance entries
        setEntries(maintenanceEntries)
        setStats(calculateStats(maintenanceEntries))
        setLoading(false)
      } else {
        // Fallback to loading mock data
        loadVehicleMaintenanceHistory()
      }
    }
  }, [isOpen, vehicle, maintenanceEntries])

  const calculateStats = (entries: MaintenanceEntry[]): MaintenanceStats => {
    const totalCost = entries.reduce((sum, entry) => sum + entry.cost, 0)
    const sortedByDate = entries.sort((a, b) => new Date(b.entry_date).getTime() - new Date(a.entry_date).getTime())
    
    return {
      totalEntries: entries.length,
      totalCost,
      lastServiceDate: sortedByDate.length > 0 ? sortedByDate[0].entry_date : null,
      nextServiceDue: sortedByDate.length > 0 ? sortedByDate[0].next_service_due : null,
      averageServiceInterval: entries.length > 1 ? 
        Math.round((vehicle?.current_mileage || 0) / entries.length) : 0
    }
  }

  useEffect(() => {
    if (isOpen && vehicle) {
      loadVehicleMaintenanceHistory()
    }
  }, [isOpen, vehicle])

  const loadVehicleMaintenanceHistory = async () => {
    if (!vehicle) return
    
    setLoading(true)
    try {
      // Mock data for now - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock maintenance entries for this specific vehicle
      const mockEntries: MaintenanceEntry[] = [
        {
          id: '1',
          vehicle_id: vehicle.id,
          entry_date: new Date(Date.now() - 86400000 * 30).toISOString(), // 30 days ago
          mileage: vehicle.current_mileage - 3000,
          maintenance_type: 'routine',
          work_performed: 'Oil change, filter replacement, and 15-point inspection',
          parts_used: ['Oil Filter', '5W-30 Motor Oil (6 quarts)', 'Air Filter'],
          labor_hours: 1.5,
          cost: 89.99,
          technician: 'Mike Johnson',
          next_service_due: new Date(Date.now() + 86400000 * 60).toISOString(),
          next_service_mileage: vehicle.current_mileage + 2000,
          notes: 'Vehicle in excellent condition. No issues found during inspection.',
          location_id: 'test-location-uuid',
          created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
          updated_at: new Date(Date.now() - 86400000 * 30).toISOString(),
          vehicle: {
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            license_plate: vehicle.license_plate,
            vehicle_id: vehicle.id
          }
        },
        {
          id: '2',
          vehicle_id: vehicle.id,
          entry_date: new Date(Date.now() - 86400000 * 90).toISOString(), // 90 days ago
          mileage: vehicle.current_mileage - 8000,
          maintenance_type: 'preventive',
          work_performed: 'Brake pad replacement and rotor resurfacing',
          parts_used: ['Front Brake Pads', 'Rear Brake Pads', 'Brake Fluid (DOT 4)', 'Brake Cleaner'],
          labor_hours: 3.0,
          cost: 425.50,
          technician: 'Sarah Davis',
          next_service_due: new Date(Date.now() + 86400000 * 90).toISOString(),
          next_service_mileage: vehicle.current_mileage + 10000,
          notes: 'Brake pads were at 20% remaining. Rotors resurfaced successfully. Customer advised on gentle break-in period.',
          location_id: 'test-location-uuid',
          created_at: new Date(Date.now() - 86400000 * 90).toISOString(),
          updated_at: new Date(Date.now() - 86400000 * 90).toISOString(),
          vehicle: {
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            license_plate: vehicle.license_plate,
            vehicle_id: vehicle.id
          }
        },
        {
          id: '3',
          vehicle_id: vehicle.id,
          entry_date: new Date(Date.now() - 86400000 * 180).toISOString(), // 6 months ago
          mileage: vehicle.current_mileage - 15000,
          maintenance_type: 'inspection',
          work_performed: 'Annual safety inspection and emissions test',
          parts_used: [],
          labor_hours: 0.5,
          cost: 45.00,
          technician: 'Robert Chen',
          notes: 'Passed all safety and emissions requirements. Certificate valid for 12 months.',
          location_id: 'test-location-uuid',
          created_at: new Date(Date.now() - 86400000 * 180).toISOString(),
          updated_at: new Date(Date.now() - 86400000 * 180).toISOString(),
          vehicle: {
            make: vehicle.make,
            model: vehicle.model,
            year: vehicle.year,
            license_plate: vehicle.license_plate,
            vehicle_id: vehicle.id
          }
        }
      ]
      
      setEntries(mockEntries)
      
      // Calculate stats
      const totalCost = mockEntries.reduce((sum, entry) => sum + entry.cost, 0)
      const lastServiceDate = mockEntries.length > 0 ? mockEntries[0].entry_date : null
      const nextServiceDue = mockEntries.find(entry => entry.next_service_due)?.next_service_due || null
      
      setStats({
        totalEntries: mockEntries.length,
        totalCost,
        lastServiceDate,
        nextServiceDue,
        averageServiceInterval: 90 // days
      })
      
    } catch (error) {
      console.error('Error loading vehicle maintenance history:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMaintenanceTypeInfo = (type: MaintenanceEntry['maintenance_type']) => {
    switch (type) {
      case 'routine':
        return { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: 'text-blue-600', label: 'Routine' }
      case 'preventive':
        return { color: 'bg-green-100 text-green-800 border-green-200', icon: 'text-green-600', label: 'Preventive' }
      case 'emergency':
        return { color: 'bg-red-100 text-red-800 border-red-200', icon: 'text-red-600', label: 'Emergency' }
      case 'inspection':
        return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: 'text-yellow-600', label: 'Inspection' }
      default:
        return { color: 'bg-gray-100 text-gray-800 border-gray-200', icon: 'text-gray-600', label: 'Other' }
    }
  }

  const handleExportHistory = () => {
    console.log('Export maintenance history for vehicle:', vehicle?.license_plate)
    // TODO: Implement CSV/PDF export functionality
  }

  if (!isOpen || !vehicle) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <button
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
          aria-label="Close modal"
        />
        
        {/* Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Car size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    {vehicle.make} {vehicle.model}
                  </h2>
                  <p className="text-blue-100 text-sm">
                    {vehicle.year} • {vehicle.license_plate} • {vehicle.current_mileage.toLocaleString()} miles
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">Loading maintenance history...</p>
              </div>
            ) : (
              <div className="p-6 space-y-6">
                {/* Stats Cards */}
                {stats && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{stats.totalEntries}</div>
                      <div className="text-sm text-gray-600">Total Services</div>
                    </Card>
                    <Card className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">${stats.totalCost.toFixed(2)}</div>
                      <div className="text-sm text-gray-600">Total Cost</div>
                    </Card>
                    <Card className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {stats.lastServiceDate 
                          ? new Date(stats.lastServiceDate).toLocaleDateString() 
                          : 'N/A'
                        }
                      </div>
                      <div className="text-sm text-gray-600">Last Service</div>
                    </Card>
                    <Card className="p-4 text-center">
                      <div className="text-2xl font-bold text-orange-600">{stats.averageServiceInterval}</div>
                      <div className="text-sm text-gray-600">Avg. Days Between</div>
                    </Card>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button
                    onClick={() => onAddNewEntry?.(vehicle.id)}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus size={16} />
                    <span>Add New Entry</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleExportHistory}
                    className="flex items-center space-x-2"
                  >
                    <Download size={16} />
                    <span>Export History</span>
                  </Button>
                </div>

                {/* Next Service Alert */}
                {stats?.nextServiceDue && (
                  <Card className="p-4 bg-yellow-50 border-yellow-200">
                    <div className="flex items-center space-x-3">
                      <Warning size={20} className="text-yellow-600" />
                      <div>
                        <h4 className="font-medium text-yellow-800">Service Due Soon</h4>
                        <p className="text-yellow-700 text-sm">
                          Next service scheduled for {new Date(stats.nextServiceDue).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Maintenance Timeline */}
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <ClipboardText size={20} className="text-blue-600" />
                    <span>Maintenance Timeline</span>
                  </h3>

                  {entries.length === 0 ? (
                    <div className="text-center py-8">
                      <Wrench size={48} className="mx-auto text-gray-400 mb-4" />
                      <h4 className="text-lg font-medium text-gray-900 mb-2">No maintenance history</h4>
                      <p className="text-gray-600 mb-4">Start tracking maintenance for this vehicle</p>
                      <Button
                        onClick={() => onAddNewEntry?.(vehicle.id)}
                        className="flex items-center space-x-2"
                      >
                        <Plus size={16} />
                        <span>Add First Entry</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {entries.map((entry, index) => {
                        const typeInfo = getMaintenanceTypeInfo(entry.maintenance_type)
                        const entryDate = new Date(entry.entry_date)
                        
                        return (
                          <div key={entry.id} className="relative">
                            {/* Timeline connector */}
                            {index < entries.length - 1 && (
                              <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200" />
                            )}
                            
                            <div className="flex space-x-4">
                              {/* Timeline dot */}
                              <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center bg-white ${typeInfo.color}`}>
                                <Wrench size={16} className={typeInfo.icon} />
                              </div>
                              
                              {/* Entry content */}
                              <div className="flex-1 min-w-0">
                                <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                                  <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                      <Badge className={`${typeInfo.color} border`}>
                                        {typeInfo.label}
                                      </Badge>
                                      <span className="text-sm text-gray-500">
                                        {entryDate.toLocaleDateString()} • {entry.mileage.toLocaleString()} miles
                                      </span>
                                    </div>
                                    <span className="text-lg font-semibold text-green-600">
                                      ${entry.cost.toFixed(2)}
                                    </span>
                                  </div>
                                  
                                  <h4 className="font-medium text-gray-900 mb-2">{entry.work_performed}</h4>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                                    <div className="flex items-center space-x-1">
                                      <User size={14} />
                                      <span>Tech: {entry.technician}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Timer size={14} />
                                      <span>Labor: {entry.labor_hours}h</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Gauge size={14} />
                                      <span>Mileage: {entry.mileage.toLocaleString()}</span>
                                    </div>
                                  </div>
                                  
                                  {entry.parts_used.length > 0 && (
                                    <div className="mb-3">
                                      <p className="text-sm font-medium text-gray-700 mb-1">Parts Used:</p>
                                      <div className="flex flex-wrap gap-1">
                                        {entry.parts_used.map((part, partIndex) => (
                                          <span
                                            key={`${entry.id}-part-${partIndex}`}
                                            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                                          >
                                            {part}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {entry.notes && (
                                    <div className="mb-3 p-3 bg-gray-50 rounded text-sm text-gray-700">
                                      {entry.notes}
                                    </div>
                                  )}
                                  
                                  {entry.next_service_due && (
                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                                      <div className="flex items-center space-x-2 text-sm text-blue-700">
                                        <Calendar size={14} />
                                        <span>
                                          Next service: {new Date(entry.next_service_due).toLocaleDateString()}
                                          {entry.next_service_mileage && ` at ${entry.next_service_mileage.toLocaleString()} miles`}
                                        </span>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default VehicleMaintenanceModal
