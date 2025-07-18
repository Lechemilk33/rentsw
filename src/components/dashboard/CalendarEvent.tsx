/**
 * Individual Calendar Event Component for RENTAGAIN Dashboard
 */

import React from 'react'
import { Wrench, Calendar as CalendarIcon, Check } from 'phosphor-react'
import type { CalendarEvent, CalendarCategory } from './CalendarTypes'
import { getCategoryStyle } from './calendarUtils'

interface CalendarEventComponentProps {
  event: CalendarEvent
  categories: CalendarCategory[]
  isDragging: boolean
  draggedEvent: CalendarEvent | null
  onEventClick: (event: CalendarEvent) => void
  onDragStart: (event: CalendarEvent, e: React.DragEvent) => void
  onDragEnd: (e: React.DragEvent) => void
}

export function CalendarEventComponent({
  event,
  categories,
  isDragging,
  draggedEvent,
  onEventClick,
  onDragStart,
  onDragEnd
}: Readonly<CalendarEventComponentProps>) {
  const style = getCategoryStyle(event.categoryId, categories)
  const isBeingDragged = isDragging && draggedEvent?.id === event.id
  const isDraggable = event.type !== 'maintenance'

  return (
    <div 
      className={`relative ${isBeingDragged ? 'opacity-50' : ''}`}
    >
      <button
        type="button"
        draggable={isDraggable}
        onDragStart={(e) => {
          if (!isDraggable || isDragging) {
            e.preventDefault()
            return
          }
          e.stopPropagation()
          onDragStart(event, e)
        }}
        onDragEnd={(e) => {
          if (isDraggable && isDragging) {
            e.stopPropagation()
            onDragEnd(e)
          }
        }}
        onClick={(e) => {
          e.stopPropagation()
          if (!isDragging) {
            onEventClick(event)
          }
        }}
        className={`
          w-full p-3 border rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 text-left
          ${isDraggable ? 'cursor-move hover:shadow-md hover:scale-[1.01]' : 'cursor-pointer'}
          ${isBeingDragged ? 'opacity-40 scale-95 z-50' : 'opacity-100'}
          ${isDragging && !isBeingDragged ? 'pointer-events-none' : ''}
        `}
        style={{
          backgroundColor: style.backgroundColor,
          borderColor: style.borderColor,
          color: style.color,
          minHeight: '60px'
        }}
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            {event.type === 'maintenance' ? (
              <Wrench size={14} className="text-yellow-600 flex-shrink-0" />
            ) : (
              <CalendarIcon size={14} className="text-blue-600 flex-shrink-0" />
            )}
            <span className="font-medium text-sm truncate">
              {event.title}
            </span>
            {event.isCompleted && (
              <Check size={14} className="text-green-600 flex-shrink-0" />
            )}
          </div>
          {event.startTime && (
            <span className="text-xs font-medium opacity-80 flex-shrink-0">
              {event.startTime}
              {event.endTime && ` - ${event.endTime}`}
            </span>
          )}
        </div>
        
        {event.description && (
          <p className="text-xs opacity-80 line-clamp-2">
            {event.description}
          </p>
        )}
        
        {(event.vehicleId || event.assignedTo) && (
          <div className="mt-2 text-xs opacity-70">
            {event.vehicleId && <span>Vehicle: {event.vehicleId}</span>}
            {event.assignedTo && (
              <span className={event.vehicleId ? ' | Assigned: ' + event.assignedTo : 'Assigned: ' + event.assignedTo}></span>
            )}
          </div>
        )}
      </button>
    </div>
  )
}
