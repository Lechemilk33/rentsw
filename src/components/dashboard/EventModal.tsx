/**
 * Event Creation/Editing Modal for RENTAGAIN Dashboard
 */

import React, { useState } from 'react'
import { X, Trash } from 'phosphor-react'
import { Button } from '../ui'
import type { CalendarEvent, CalendarCategory } from './CalendarTypes'
import { getNextHour } from './calendarUtils'

interface EventModalProps {
  event: CalendarEvent & { isReadOnly?: boolean }
  categories: CalendarCategory[]
  onSave: (event: CalendarEvent) => void
  onDelete: (eventId: string) => void
  onClose: () => void
}

export function EventModal({ event, categories, onSave, onDelete, onClose }: EventModalProps) {
  const [formData, setFormData] = useState({
    title: event.title,
    description: event.description || '',
    date: event.date,
    startTime: event.startTime || '09:00',
    endTime: event.endTime || getNextHour(event.startTime || '09:00'),
    categoryId: event.categoryId || 'booking',
    vehicleId: event.vehicleId || '',
    assignedTo: event.assignedTo || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    onSave({
      ...event,
      title: formData.title,
      description: formData.description,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      categoryId: formData.categoryId,
      vehicleId: formData.vehicleId || undefined,
      assignedTo: formData.assignedTo || undefined
    })
  }

  const isEditing = !!event.title
  const isTaskType = event.type === 'task' || event.type === 'custom'
  const isReadOnly = event.isReadOnly || event.type === 'booking'

  return (
    <div 
      className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose()
        }
      }}
    >
      <div 
        className="bg-white w-full max-w-md rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto border border-gray-200"
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 id="modal-title" className="text-xl font-semibold text-gray-900">
            {isReadOnly ? 'View Event Details' : isEditing ? 'Edit Event' : 'New Event'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 -m-2 rounded-lg hover:bg-gray-100"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {isReadOnly && event.type === 'booking' && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Booking Event:</strong> This is a customer booking from your reservation system. 
                To modify this booking, please use the main booking management interface.
              </p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="event-title" className="block text-sm font-medium text-gray-700 mb-2">
                Event Title *
              </label>
              <input
                id="event-title"
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                disabled={isReadOnly}
                className={`w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base min-h-[44px] ${
                  isReadOnly ? 'bg-gray-50 text-gray-700 cursor-not-allowed' : ''
                }`}
                placeholder="Enter event title"
              />
            </div>

            <div>
              <label htmlFor="event-description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="event-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                disabled={isReadOnly}
                className={`w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base resize-none ${
                  isReadOnly ? 'bg-gray-50 text-gray-700 cursor-not-allowed' : ''
                }`}
                rows={3}
                placeholder="Event details..."
              />
            </div>

            {/* Date and Time Section */}
            <div className="space-y-4">
              <div>
                <label htmlFor="event-date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  id="event-date"
                  type="date"
                  required
                  value={event.date ? event.date.toISOString().split('T')[0] : ''}
                  onChange={(e) => {
                    const newDate = new Date(e.target.value)
                    setFormData(prev => ({ ...prev, date: newDate }))
                  }}
                  disabled={isReadOnly}
                  className={`w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base min-h-[44px] ${
                    isReadOnly ? 'bg-gray-50 text-gray-700 cursor-not-allowed' : ''
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="start-time" className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time *
                  </label>
                  <input
                    id="start-time"
                    type="time"
                    required
                    value={formData.startTime || '09:00'}
                    onChange={(e) => {
                      const startTime = e.target.value
                      const endTime = getNextHour(startTime)
                      setFormData(prev => ({ 
                        ...prev, 
                        startTime,
                        endTime
                      }))
                    }}
                    disabled={isReadOnly}
                    className={`w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base min-h-[44px] ${
                      isReadOnly ? 'bg-gray-50 text-gray-700 cursor-not-allowed' : ''
                    }`}
                  />
                </div>

                <div>
                  <label htmlFor="end-time" className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    id="end-time"
                    type="time"
                    value={formData.endTime || getNextHour(formData.startTime || '09:00')}
                    onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                    disabled={isReadOnly}
                    className={`w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base min-h-[44px] ${
                      isReadOnly ? 'bg-gray-50 text-gray-700 cursor-not-allowed' : ''
                    }`}
                  />
                </div>
              </div>
            </div>

            {isTaskType && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="vehicle-id" className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle (Optional)
                  </label>
                  <input
                    id="vehicle-id"
                    type="text"
                    value={formData.vehicleId}
                    onChange={(e) => setFormData(prev => ({ ...prev, vehicleId: e.target.value }))}
                    className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base min-h-[44px]"
                    placeholder="Vehicle ID or License Plate"
                  />
                </div>
                <div>
                  <label htmlFor="assigned-to" className="block text-sm font-medium text-gray-700 mb-2">
                    Assign To (Optional)
                  </label>
                  <input
                    id="assigned-to"
                    type="text"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData(prev => ({ ...prev, assignedTo: e.target.value }))}
                    className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base min-h-[44px]"
                    placeholder="Assignee Name or ID"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="event-category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="event-category"
                value={formData.categoryId}
                onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                className="w-full px-3 sm:px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base min-h-[44px]"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              
              {/* Category Color Preview */}
              {formData.categoryId && (
                <div className="mt-2 flex items-center space-x-2">
                  <div 
                    className="w-4 h-4 rounded border"
                    style={{ 
                      backgroundColor: categories.find(c => c.id === formData.categoryId)?.backgroundColor,
                      borderColor: categories.find(c => c.id === formData.categoryId)?.borderColor
                    }}
                  />
                  <span className="text-sm text-gray-600">
                    Color: {categories.find(c => c.id === formData.categoryId)?.name}
                  </span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-between pt-4 sm:pt-6 space-y-3 sm:space-y-0 border-t border-gray-200">
              {isEditing && !isReadOnly && (event.type === 'custom' || event.type === 'task') && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onDelete(event.id)}
                  className="text-red-600 hover:text-red-700 flex items-center justify-center space-x-1 min-h-[44px] order-2 sm:order-1"
                >
                  <Trash size={16} />
                  <span>Delete</span>
                </Button>
              )}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 order-1 sm:order-2 sm:ml-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="min-h-[44px] w-full sm:w-auto"
                >
                  {isReadOnly ? 'Close' : 'Cancel'}
                </Button>
                {!isReadOnly && (
                  <Button 
                    type="submit"
                    className="min-h-[44px] w-full sm:w-auto"
                  >
                    {isEditing ? 'Update' : 'Create'} Event
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
