/*
 * MaintenanceEntryCard - Interactive maintenance entry display
 * Professional journal-style entries with actions
 */

import React, { useState } from 'react'
import { 
  Car, 
  Calendar, 
  Clock, 
  Wrench, 
  User, 
  FileText, 
  DotsThree,
  PencilSimple,
  Trash,
  Copy,
  Eye
} from 'phosphor-react'
import { Button, Card, Badge } from '../ui'
import type { MaintenanceEntry } from './types'

interface MaintenanceEntryCardProps {
  entry: MaintenanceEntry
  onEdit?: (entry: MaintenanceEntry) => void
  onDelete?: (id: string) => void
  onDuplicate?: (entry: MaintenanceEntry) => void
  onViewDetails?: (entry: MaintenanceEntry) => void
  className?: string
}

const getMaintenanceTypeInfo = (type: string) => {
  switch (type) {
    case 'routine':
      return { label: 'Routine', color: 'info' as const }
    case 'emergency':
      return { label: 'Emergency', color: 'danger' as const }
    case 'preventive':
      return { label: 'Preventive', color: 'success' as const }
    case 'inspection':
      return { label: 'Inspection', color: 'warning' as const }
    default:
      return { label: 'Unknown', color: 'default' as const }
  }
}

export const MaintenanceEntryCard: React.FC<MaintenanceEntryCardProps> = ({
  entry,
  onEdit,
  onDelete,
  onDuplicate,
  onViewDetails,
  className = ''
}) => {
  const [showActions, setShowActions] = useState(false)
  const [showFullNotes, setShowFullNotes] = useState(false)

  const typeInfo = getMaintenanceTypeInfo(entry.maintenance_type)
  const formattedDate = new Date(entry.entry_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  const truncatedNotes = entry.notes && entry.notes.length > 100 
    ? entry.notes.substring(0, 100) + '...'
    : entry.notes

  return (
    <Card 
      padding="lg" 
      className={`maintenance-entry-card relative hover:shadow-md transition-shadow duration-200 ${className}`}
    >
      {/* Timeline Connector */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-200 rounded-l-lg"></div>
      <div className="absolute left-[-6px] top-6 w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>

      {/* Entry Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-responsive-lg font-semibold text-gray-900">
              {entry.vehicle?.make} {entry.vehicle?.model}
            </h3>
            <Badge variant={typeInfo.color} size="sm">
              {typeInfo.label}
            </Badge>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-responsive-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Car size={16} />
              <span>{entry.vehicle?.license_plate}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="font-medium">{entry.mileage.toLocaleString()} miles</span>
            </div>
          </div>
        </div>

        {/* Actions Dropdown */}
        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            icon={DotsThree}
            iconWeight="bold"
            onClick={() => setShowActions(!showActions)}
            className="btn-responsive text-gray-400 hover:text-gray-600"
          />
          
          {showActions && (
            <div className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <div className="py-1">
                {onViewDetails && (
                  <button
                    onClick={() => {
                      onViewDetails(entry)
                      setShowActions(false)
                    }}
                    className="w-full px-4 py-2 text-left text-responsive-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                )}
                {onEdit && (
                  <button
                    onClick={() => {
                      onEdit(entry)
                      setShowActions(false)
                    }}
                    className="w-full px-4 py-2 text-left text-responsive-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <PencilSimple size={16} />
                    Edit Entry
                  </button>
                )}
                {onDuplicate && (
                  <button
                    onClick={() => {
                      onDuplicate(entry)
                      setShowActions(false)
                    }}
                    className="w-full px-4 py-2 text-left text-responsive-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Copy size={16} />
                    Duplicate
                  </button>
                )}
                {onDelete && (
                  <>
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        onDelete(entry.id)
                        setShowActions(false)
                      }}
                      className="w-full px-4 py-2 text-left text-responsive-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash size={16} />
                      Delete Entry
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Work Performed */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Wrench size={16} className="text-gray-400" />
          <span className="text-responsive-sm font-medium text-gray-700">Work Performed</span>
        </div>
        <p className="text-responsive-base text-gray-900 ml-6">{entry.work_performed}</p>
      </div>

      {/* Parts Used */}
      {entry.parts_used.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-responsive-sm font-medium text-gray-700 ml-6">Parts Used</span>
          </div>
          <div className="ml-6 flex flex-wrap gap-2">
            {entry.parts_used.map((part, index) => (
              <Badge key={`${entry.id}-part-${index}-${part}`} variant="default" size="sm">
                {part}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Cost & Labor Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 ml-6">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-gray-400" />
          <div>
            <span className="text-responsive-xs text-gray-500">Labor Hours</span>
            <p className="text-responsive-sm font-medium text-gray-900">
              {entry.labor_hours} {entry.labor_hours === 1 ? 'hour' : 'hours'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <User size={16} className="text-gray-400" />
          <div>
            <span className="text-responsive-xs text-gray-500">Technician</span>
            <p className="text-responsive-sm font-medium text-gray-900">{entry.technician}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-responsive-xs text-gray-500">Total Cost</span>
          <p className="text-responsive-lg font-bold text-green-600">
            ${entry.cost.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Next Service */}
      {Boolean(entry.next_service_due || entry.next_service_mileage) && (
        <div className="mb-4 ml-6">
          <span className="text-responsive-sm font-medium text-gray-700">Next Service</span>
          <div className="mt-1 text-responsive-sm text-gray-600">
            {entry.next_service_due && (
              <span>Due: {new Date(entry.next_service_due).toLocaleDateString()}</span>
            )}
            {Boolean(entry.next_service_due && entry.next_service_mileage) && <span> • </span>}
            {Boolean(entry.next_service_mileage) && (
              <span>At: {entry.next_service_mileage.toLocaleString()} miles</span>
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      {entry.notes && (
        <div className="ml-6">
          <div className="flex items-center gap-2 mb-2">
            <FileText size={16} className="text-gray-400" />
            <span className="text-responsive-sm font-medium text-gray-700">Notes</span>
          </div>
          <div className="text-responsive-sm text-gray-600">
            <p>{showFullNotes ? entry.notes : truncatedNotes}</p>
            {entry.notes.length > 100 && (
              <button
                onClick={() => setShowFullNotes(!showFullNotes)}
                className="text-blue-600 hover:text-blue-800 mt-1 text-responsive-xs font-medium"
              >
                {showFullNotes ? 'Show Less' : 'Show More'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Click outside to close actions */}
      {showActions && (
        <button
          className="fixed inset-0 z-5 bg-transparent cursor-default"
          onClick={() => setShowActions(false)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setShowActions(false)
            }
          }}
          aria-label="Close actions menu"
          type="button"
        />
      )}
    </Card>
  )
}
