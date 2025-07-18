/*
 * Location Viewer Overlay Component
 * Professional vehicle location tracking interface for RENTAGAIN
 * Features: Live location display, map integration placeholder, location history
 */

import React from 'react'
import { 
  X,
  MapPin,
  Clock
} from 'phosphor-react'
import { Button, Card } from '../ui'

interface LocationViewerOverlayProps {
  vehicle: {
    id: string
    make: string
    model: string
    year: number
    license_plate: string
    location: string
    mileage: number
  }
  isOpen: boolean
  onClose: () => void
}

export function LocationViewerOverlay({ 
  vehicle, 
  isOpen, 
  onClose 
}: Readonly<LocationViewerOverlayProps>) {
  if (!isOpen) return null

  // Mock location data - replace with actual GPS/tracking service
  const mockLocationData = {
    coordinates: { lat: 40.7128, lng: -74.0060 },
    lastUpdate: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    speed: 0, // mph
    heading: 'N',
    accuracy: '±3m',
    batteryLevel: 85,
    connectionStatus: 'Connected'
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Professional backdrop */}
        <button
          className="fixed inset-0 backdrop-blur-sm transition-all duration-300 ease-out opacity-100"
          style={{ 
            backgroundColor: 'rgba(17, 24, 39, 0.25)',
            backdropFilter: 'blur(4px) saturate(1.8)',
            zIndex: 999998
          }}
          onClick={onClose}
          onKeyDown={(e) => e.key === 'Escape' && onClose()}
          aria-label="Close location viewer"
        />
        
        {/* Location Viewer Modal */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] overflow-hidden border border-gray-200" style={{ zIndex: 999999 }}>
          {/* Header */}
          <div className="relative bg-white px-6 py-5 border-b border-gray-100">
            {/* Close button */}
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={onClose}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Title */}
            <div className="pr-16">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center border border-green-200">
                  <MapPin size={24} className="text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Vehicle Location</h2>
                  <p className="text-sm text-gray-500">{vehicle.year} {vehicle.make} {vehicle.model} • {vehicle.license_plate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(95vh-12rem)]">
            <div className="p-6 space-y-6">
              
              {/* Interactive Map - Now at the top */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <MapPin size={20} className="text-blue-600" />
                  <span>Interactive Map</span>
                </h3>

                <div className="w-full h-96 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors group cursor-pointer">
                  <div className="text-center">
                    <MapPin size={48} className="mx-auto text-gray-400 group-hover:text-blue-500 mb-4" />
                    <h4 className="text-xl font-semibold text-gray-700 group-hover:text-blue-700 mb-2">
                      Map Integration
                    </h4>
                    <p className="text-gray-500 group-hover:text-blue-600 mb-4">
                      Real-time vehicle tracking will be displayed here
                    </p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>Coordinates:</strong> {mockLocationData.coordinates.lat}, {mockLocationData.coordinates.lng}</p>
                      <p><strong>Last Update:</strong> {mockLocationData.lastUpdate.toLocaleString()}</p>
                      <p><strong>Connection:</strong> {mockLocationData.connectionStatus}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Recent Location History */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <Clock size={20} className="text-orange-600" />
                  <span>Recent Location History</span>
                </h3>

                <div className="space-y-3">
                  {[
                    { id: 'loc1', time: '2 hours ago', location: 'Downtown Parking Garage', action: 'Parked' },
                    { id: 'loc2', time: '4 hours ago', location: 'Interstate 95 North', action: 'In Transit' },
                    { id: 'loc3', time: '6 hours ago', location: 'Airport Terminal B', action: 'Pickup' },
                    { id: 'loc4', time: 'Yesterday', location: 'Main Street Office', action: 'Parked' }
                  ].map((entry) => (
                    <div key={entry.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-900">{entry.location}</span>
                          <span className="text-sm text-gray-500">{entry.time}</span>
                        </div>
                        <span className="text-sm text-gray-600">{entry.action}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

            </div>

            {/* Action Buttons */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    console.log('Opening full map view for vehicle:', vehicle.id)
                    alert('Full map view will open here when map integration is complete.')
                  }}
                  className="flex items-center justify-center space-x-2 py-3"
                >
                  <MapPin size={18} />
                  <span>Open Full Map</span>
                </Button>
                <Button
                  onClick={onClose}
                  className="flex items-center justify-center space-x-2 py-3 px-6 sm:ml-auto"
                >
                  <span>Close</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LocationViewerOverlay
