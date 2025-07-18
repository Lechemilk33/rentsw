/*
 * FleetFilters Component - Search and Filter Controls
 * Professional filter interface with debounced search
 */

import React from 'react'
import { MagnifyingGlass } from 'phosphor-react'
import { Input, Button, Card } from '../ui'
import type { VehicleStatus } from './StatusDropdown'

export type FleetStatus = 'all' | VehicleStatus

interface FleetFiltersProps {
  searchInput: string
  onSearchInput: (value: string) => void
  statusFilter: FleetStatus
  onStatusFilter: (status: FleetStatus) => void
  vehicleCounts: {
    total: number
    available: number
    rented: number
    maintenance: number
  }
}

export const FleetFilters: React.FC<FleetFiltersProps> = ({
  searchInput,
  onSearchInput,
  statusFilter,
  onStatusFilter,
  vehicleCounts
}) => {
  return (
    <Card padding="md" className="card-responsive mb-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Debounced Search Input */}
        <div className="flex-1">
          <Input
            icon={MagnifyingGlass}
            iconWeight="regular"
            placeholder="Search vehicles by make, model, license plate..."
            value={searchInput}
            onChange={(e) => onSearchInput(e.target.value)}
            fullWidth
            className="input-responsive"
          />
        </div>
        
        {/* Status Filter */}
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={statusFilter === 'all' ? 'primary' : 'ghost'}
            size="md"
            onClick={() => onStatusFilter('all')}
            className="btn-responsive"
          >
            All ({vehicleCounts.total})
          </Button>
          <Button
            variant={statusFilter === 'available' ? 'primary' : 'ghost'}
            size="md"
            onClick={() => onStatusFilter('available')}
            className="btn-responsive"
          >
            Available ({vehicleCounts.available})
          </Button>
          <Button
            variant={statusFilter === 'rented' ? 'primary' : 'ghost'}
            size="md"
            onClick={() => onStatusFilter('rented')}
            className="btn-responsive"
          >
            Rented ({vehicleCounts.rented})
          </Button>
          <Button
            variant={statusFilter === 'maintenance' ? 'primary' : 'ghost'}
            size="md"
            onClick={() => onStatusFilter('maintenance')}
            className="btn-responsive"
          >
            Maintenance ({vehicleCounts.maintenance})
          </Button>
        </div>
      </div>
    </Card>
  )
}
