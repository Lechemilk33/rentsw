/*
 * FleetEmptyState Component - Empty State Display
 * Professional empty state with contextual actions
 */

import React from 'react'
import { Car, Plus } from 'phosphor-react'
import { Button } from '../ui'

interface FleetEmptyStateProps {
  hasFilters: boolean
  onClearFilters: () => void
  onAddVehicle?: () => void
}

export const FleetEmptyState: React.FC<FleetEmptyStateProps> = ({
  hasFilters,
  onClearFilters,
  onAddVehicle
}) => {
  return (
    <div className="text-center py-16">
      <Car size={64} weight="light" className="text-gray-400 mx-auto mb-4" />
      <h3 className="text-responsive-lg font-semibold text-gray-900 mb-2">
        {hasFilters ? 'No vehicles found' : 'No vehicles in fleet'}
      </h3>
      <p className="text-responsive-base text-gray-600 mb-6">
        {hasFilters 
          ? 'Try adjusting your search or filter criteria'
          : 'Add your first vehicle to get started'
        }
      </p>
      {hasFilters ? (
        <Button 
          variant="outline" 
          onClick={onClearFilters}
          className="btn-responsive"
        >
          Clear Filters
        </Button>
      ) : (
        <Button 
          variant="primary" 
          icon={Plus} 
          iconWeight="bold"
          onClick={onAddVehicle}
          className="btn-responsive"
        >
          Add Vehicle
        </Button>
      )}
    </div>
  )
}
