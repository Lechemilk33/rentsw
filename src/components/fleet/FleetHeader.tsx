/*
 * Enterprise Fleet Header Component
 * World-class header with advanced controls and professional styling
 */

import React from 'react'
import { Plus, Funnel, ArrowsClockwise, Download, Gear } from 'phosphor-react'

interface FleetHeaderProps {
  totalVehicles: number
  selectedCount: number
  onAddVehicle: () => void
  onRefresh: () => void
  onExport: () => void
  onBulkAction: () => void
  isLoading?: boolean
}

export const FleetHeader: React.FC<FleetHeaderProps> = ({
  totalVehicles,
  selectedCount,
  onAddVehicle,
  onRefresh,
  onExport,
  onBulkAction,
  isLoading = false
}) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="px-8 py-6">
        {/* Main Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Fleet Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and monitor your luxury vehicle fleet operations
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Refresh Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              className={`
                inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium
                rounded-lg border border-gray-300 bg-white text-gray-700
                hover:bg-gray-50 hover:border-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-all duration-200
                ${isLoading ? 'animate-pulse' : ''}
              `}
              aria-label="Refresh fleet data"
            >
              <ArrowsClockwise 
                size={16} 
                className={isLoading ? 'animate-spin' : ''} 
              />
              Refresh
            </button>

            {/* Export Button */}
            <button
              onClick={onExport}
              className="
                inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium
                rounded-lg border border-gray-300 bg-white text-gray-700
                hover:bg-gray-50 hover:border-gray-400
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                transition-all duration-200
              "
            >
              <Download size={16} />
              Export
            </button>

            {/* Add Vehicle Button */}
            <button
              onClick={onAddVehicle}
              className="
                inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold
                rounded-lg bg-blue-600 text-white border border-blue-600
                hover:bg-blue-700 hover:border-blue-700
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                transition-all duration-200 shadow-sm
              "
            >
              <Plus size={16} weight="bold" />
              Add Vehicle
            </button>
          </div>
        </div>

        {/* Stats and Bulk Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">{totalVehicles}</span> vehicles total
            </div>
            
            {selectedCount > 0 && (
              <div className="flex items-center gap-3 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <span className="text-sm font-medium text-blue-900">
                  {selectedCount} selected
                </span>
                <button
                  onClick={onBulkAction}
                  className="
                    inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
                    rounded-md bg-blue-600 text-white
                    hover:bg-blue-700
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                    transition-all duration-200
                  "
                >
                  <Gear size={12} />
                  Bulk Actions
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Filter Toggle */}
            <button className="
              inline-flex items-center gap-2 px-3 py-2 text-sm font-medium
              rounded-lg border border-gray-300 bg-white text-gray-700
              hover:bg-gray-50 hover:border-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              transition-all duration-200
            ">
              <Funnel size={14} />
              Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
