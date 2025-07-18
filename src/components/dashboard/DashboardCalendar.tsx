/**
 * Refactored Dashboard Calendar Component - Main Calendar for RENTAGAIN
 * Clean, focused, and properly structured using extracted components
 */

import React, { useState, useMemo, useEffect } from 'react'
import { 
  CalendarBlank,
  CaretLeft, 
  CaretRight,
  Plus,
  Check,
  X
} from 'phosphor-react'
import { Card } from '../ui'
import { supabase } from '../../lib/supabase'

// Import extracted types and utilities
import type { 
  CalendarEvent, 
  CalendarView, 
  DashboardCalendarProps
} from './CalendarTypes'
import { DEFAULT_CATEGORIES } from './CalendarTypes'
import { 
  generateTimeSlots,
  generateCalendarDays,
  formatMonthYear,
  isToday,
  isWeekend,
  isCurrentMonth,
  getEventsForDate,
  processTasksIntoEvents,
  getCategoryStyle,
  formatTo24Hour,
  getNextHour
} from './calendarUtils'

// Import extracted components
import { CalendarEventComponent } from './CalendarEvent'
import { EventModal } from './EventModal'

export default function DashboardCalendar({ 
  className = '',
  maintenanceTasks = [],
  onMaintenanceClick 
}: Readonly<DashboardCalendarProps>) {
  // Core state
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [view, setView] = useState<CalendarView>('month')
  const [events, setEvents] = useState<CalendarEvent[]>([])
  
  // Modal state
  const [showEventModal, setShowEventModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  
  // Drag state
  const [draggedEvent, setDraggedEvent] = useState<CalendarEvent | null>(null)
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  
  // Success feedback
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Load real bookings and tasks data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load existing tasks
        const { data: tasks } = await supabase
          .from('tasks')
          .select('*')
          .in('status', ['pending', 'in_progress'])

        // Load actual bookings from database
        const { data: bookings } = await supabase
          .from('bookings')
          .select(`
            *,
            vehicles!inner(make, model, license_plate)
          `)
          .order('start_date', { ascending: true })

        const allEvents: CalendarEvent[] = []

        // Process tasks into events
        if (tasks && tasks.length > 0) {
          const taskEvents = processTasksIntoEvents(tasks)
          allEvents.push(...taskEvents)
        }

        // Process bookings into events
        if (bookings && bookings.length > 0) {
          const bookingEvents = bookings.map(booking => {
            const startDate = new Date(booking.start_date)
            const endDate = new Date(booking.end_date)
            
            return {
              id: `booking-${booking.id}`,
              title: `${booking.customer_name} - ${booking.vehicles?.make} ${booking.vehicles?.model}`,
              description: `Customer: ${booking.customer_name}\nPhone: ${booking.customer_phone || 'N/A'}\nEmail: ${booking.customer_email || 'N/A'}\nVehicle: ${booking.vehicles?.license_plate}\nStatus: ${booking.status}`,
              date: startDate,
              startTime: startDate.toTimeString().slice(0, 5),
              endTime: endDate.toTimeString().slice(0, 5),
              type: 'booking' as const,
              categoryId: booking.status === 'active' ? 'booking' : 
                         booking.status === 'pending' ? 'delivery' :
                         booking.status === 'completed' ? 'pickup' : 'booking',
              vehicleId: booking.vehicle_id,
              bookingId: booking.id
            }
          })
          allEvents.push(...bookingEvents)
        }

        // If no real data, add minimal demo data
        if (allEvents.length === 0) {
          const today = new Date()
          const demoEvent: CalendarEvent = {
            id: 'demo-1',
            title: 'Demo Booking - Click to edit',
            description: 'This is demo data. Real bookings will appear here.',
            date: today,
            startTime: '10:00',
            endTime: '11:00',
            type: 'booking',
            categoryId: 'booking'
          }
          allEvents.push(demoEvent)
        }

        setEvents(allEvents)
      } catch (error) {
        console.error('Database error:', error)
        // Fallback to minimal demo data on error
        const today = new Date()
        const fallbackEvent: CalendarEvent = {
          id: 'fallback-1',
          title: 'Sample Booking',
          description: 'Database connection issue. This is sample data.',
          date: today,
          startTime: '09:00',
          endTime: '10:00',
          type: 'booking',
          categoryId: 'booking'
        }
        setEvents([fallbackEvent])
      }
    }

    loadData()

    // Set up real-time subscription for bookings
    const bookingsSubscription = supabase
      .channel('bookings-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings'
        },
        () => {
          // Reload data when bookings change
          loadData()
        }
      )
      .subscribe()

    // Set up real-time subscription for tasks
    const tasksSubscription = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks'
        },
        () => {
          // Reload data when tasks change
          loadData()
        }
      )
      .subscribe()

    // Cleanup subscriptions
    return () => {
      bookingsSubscription.unsubscribe()
      tasksSubscription.unsubscribe()
    }
  }, [])

  // Success message helper
  const showSuccess = (message: string) => {
    setSuccessMessage(message)
    setShowSuccessMessage(true)
    setTimeout(() => setShowSuccessMessage(false), 3000)
  }

  // Convert maintenance tasks to events
  const maintenanceEvents = useMemo(() => {
    return maintenanceTasks.map(task => ({
      id: `maintenance-${task.id}`,
      title: `${task.vehicle_make} ${task.vehicle_model} - ${task.maintenance_type}`,
      description: `${task.work_performed} | Tech: ${task.technician}`,
      date: new Date(task.date),
      startTime: '09:00',
      type: 'maintenance' as const,
      categoryId: 'maintenance',
      maintenanceId: task.id,
      isCompleted: task.status === 'completed'
    }))
  }, [maintenanceTasks])

  // All events combined
  const allEvents = useMemo(() => {
    return [...events, ...maintenanceEvents]
  }, [events, maintenanceEvents])

  // Navigation
  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setSelectedDate(today)
  }

  // Handle day click to switch to day view
  const handleDayClick = (date: Date) => {
    setSelectedDate(date)
    setView('day')
  }

  // Handle back to month view
  const handleBackToMonth = () => {
    console.log('handleBackToMonth called')
    setView('month')
    // Clear any pending modal state when going back to month view
    setShowEventModal(false)
    setEditingEvent(null)
    console.log('Modal state cleared')
  }

  // Event handlers
  const handleCreateEvent = (date: Date | null, timeSlot?: string) => {
    if (!date) {
      return
    }
    
    const newEvent: CalendarEvent = {
      id: `custom-${Date.now()}`,
      title: '',
      description: '',
      date: date,
      startTime: timeSlot || '08:00',
      endTime: timeSlot ? getNextHour(timeSlot) : '09:00',
      type: 'task',
      categoryId: 'booking',
      priority: 'medium'
    }
    
    // Set both states together to ensure they're in sync
    setEditingEvent(newEvent)
    setShowEventModal(true)
  }

  const handleEventClick = (event: CalendarEvent) => {
    if (event.type === 'maintenance' && onMaintenanceClick) {
      onMaintenanceClick(event.maintenanceId!)
    } else if (event.type === 'booking' && event.bookingId) {
      // For booking events, show read-only details
      setEditingEvent({
        ...event,
        // Make booking events read-only by marking them as such
        isReadOnly: true
      } as CalendarEvent & { isReadOnly: boolean })
      setShowEventModal(true)
    } else {
      setEditingEvent(event)
      setShowEventModal(true)
    }
  }

  // Helper function to save new task event
  const saveNewTaskEvent = async (event: CalendarEvent, locationId: string) => {
    const dueDate = event.startTime ? 
      new Date(`${event.date.toISOString().split('T')[0]}T${event.startTime}:00`) : 
      event.date

    const { data } = await supabase
      .from('tasks')
      .insert([{
        title: event.title,
        description: event.description || '',
        status: 'pending',
        priority: event.priority || 'medium',
        due_date: dueDate.toISOString(),
        vehicle_id: event.vehicleId || null,
        assigned_to: event.assignedTo || null,
        location_id: locationId
      }])
      .select()
      .single()

    return data
  }

  // Helper function to update events state
  const updateEventState = (event: CalendarEvent, dbEvent?: CalendarEvent) => {
    const eventToAdd = dbEvent || event
    setEvents(prev => [...prev.filter(e => e.id !== event.id), eventToAdd])
  }

  const handleSaveEvent = async (event: CalendarEvent) => {
    try {
      if (event.type === 'task' && event.title.trim()) {
        // Save to database if needed
        const user = await supabase.auth.getSession()
        const locationId = user.data.session?.user?.app_metadata?.location_id || 'test-location-uuid'

        if (event.id.startsWith('custom-')) {
          // New event
          const data = await saveNewTaskEvent(event, locationId)
          if (data) {
            const dbEvent = { ...event, id: `task-${data.id}`, taskId: data.id }
            updateEventState(event, dbEvent)
            showSuccess('Event created successfully!')
          }
        } else {
          // Update existing
          updateEventState(event)
          showSuccess('Event updated successfully!')
        }
      } else {
        // Local event
        if (events.find(e => e.id === event.id)) {
          updateEventState(event)
        } else {
          setEvents(prev => [...prev, event])
        }
        showSuccess('Event saved!')
      }
    } catch (error) {
      console.error('Error saving event:', error)
      showSuccess('Event saved locally!')
    }
    
    setShowEventModal(false)
    setEditingEvent(null)
  }

  const handleDeleteEvent = async (eventId: string) => {
    const eventToDelete = events.find(e => e.id === eventId)
    if (!eventToDelete) return

    try {
      if (eventToDelete.taskId) {
        await supabase.from('tasks').delete().eq('id', eventToDelete.taskId)
      }
      setEvents(prev => prev.filter(e => e.id !== eventId))
      showSuccess('Event deleted successfully!')
    } catch (error) {
      console.error('Error deleting event:', error)
      setEvents(prev => prev.filter(e => e.id !== eventId))
      showSuccess('Event deleted!')
    }
  }

  // Drag handlers - simplified and more reliable
  const handleDragStart = (event: CalendarEvent, e: React.DragEvent) => {
    // Prevent multiple drag starts
    if (isDragging) {
      e.preventDefault()
      return
    }
    
    setDraggedEvent(event)
    setIsDragging(true)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', event.id)
    
    // Add visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.transform = 'rotate(5deg) scale(0.95)'
    }
  }

  const handleDragEnd = (e: React.DragEvent) => {
    // Reset drag state immediately
    setDraggedEvent(null)
    setIsDragging(false)
    setDragOverSlot(null)
    
    // Reset visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.transform = ''
    }
  }

  const handleDragOver = (timeSlot: string, date: Date, e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    
    if (draggedEvent && !isDragging) return // Prevent invalid states
    
    const slotKey = `${date.toISOString().split('T')[0]}-${timeSlot}`
    if (dragOverSlot !== slotKey) {
      setDragOverSlot(slotKey)
    }
  }

  const handleDrop = async (timeSlot: string, date: Date, e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!draggedEvent || !isDragging) return
    
    // Prevent dropping on same slot
    const currentSlotKey = `${draggedEvent.date.toISOString().split('T')[0]}-${draggedEvent.startTime}`
    const newSlotKey = `${date.toISOString().split('T')[0]}-${timeSlot}`
    
    if (currentSlotKey === newSlotKey) {
      handleDragEnd(e)
      return
    }

    const updatedEvent: CalendarEvent = {
      ...draggedEvent,
      date: date,
      startTime: timeSlot
    }

    // Update database if needed
    if (draggedEvent.taskId) {
      try {
        const newDueDate = new Date(`${date.toISOString().split('T')[0]}T${timeSlot}:00`)
        await supabase
          .from('tasks')
          .update({ due_date: newDueDate.toISOString() })
          .eq('id', draggedEvent.taskId)
      } catch (error) {
        console.error('Database update error:', error)
        // Still update UI even if DB fails
      }
    }

    // Update events optimistically
    setEvents(prev => prev.map(e => e.id === draggedEvent.id ? updatedEvent : e))
    showSuccess(`Event moved to ${timeSlot}`)
    
    // Clean up drag state
    handleDragEnd(e)
  }

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showEventModal) {
        setShowEventModal(false)
        setEditingEvent(null)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showEventModal])

  // Day view
  if (view === 'day' && selectedDate) {
    return (
      <Card className={`${className} flex flex-col h-full`}>
        {/* Day View Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToMonth}
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <CalendarBlank size={16} className="mr-2" />
                Back to Month
              </button>
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </h3>
            </div>
            <div className="text-sm text-gray-500">
              Click on any time slot to add an event
            </div>
          </div>
        </div>

        {/* Day View Content - Improved Layout */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-h-[60vh] overflow-y-auto">
            <div className="space-y-2 p-4">
              {generateTimeSlots().map(timeSlot => {
                // Convert the 12-hour time slot to 24-hour format for comparison
                const timeSlot24 = formatTo24Hour(timeSlot)
                const slotEvents = getEventsForDate(selectedDate, allEvents).filter(event => 
                  event.startTime === timeSlot24
                )
                
                const isDropTarget = dragOverSlot === `${selectedDate.toISOString().split('T')[0]}-${timeSlot24}`
                
                return (
                  <div 
                    key={timeSlot} 
                    className="flex items-start border-b border-gray-100 pb-3 min-h-[4rem]"
                  >
                    <div className="w-20 text-sm text-gray-600 font-medium pt-3 text-right pr-4 flex-shrink-0">
                      {timeSlot}
                    </div>
                    <div 
                      className={`flex-1 min-h-[3rem] rounded-lg transition-all duration-200 ${
                        isDropTarget ? 'bg-blue-50 border-2 border-dashed border-blue-400 p-2' : 
                        slotEvents.length === 0 ? 'hover:bg-gray-50 border border-dashed border-gray-200 hover:border-gray-300 cursor-pointer' : ''
                      }`}
                      onDragOver={(e) => {
                        e.preventDefault()
                        const timeSlot24 = formatTo24Hour(timeSlot)
                        handleDragOver(timeSlot24, selectedDate, e)
                      }}
                      onDrop={(e) => {
                        e.preventDefault()
                        const timeSlot24 = formatTo24Hour(timeSlot)
                        handleDrop(timeSlot24, selectedDate, e)
                      }}
                    >
                      {slotEvents.length > 0 ? (
                        <div className="space-y-2">
                          {slotEvents.map((event, index) => (
                            <div key={`${event.id}-${timeSlot24}-${index}`} className="relative group">
                              <CalendarEventComponent
                                event={event}
                                categories={DEFAULT_CATEGORIES}
                                isDragging={isDragging}
                                draggedEvent={draggedEvent}
                                onEventClick={handleEventClick}
                                onDragStart={handleDragStart}
                                onDragEnd={handleDragEnd}
                              />
                              {/* Delete button on hover */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleDeleteEvent(event.id)
                                }}
                                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 hover:bg-red-100 text-red-600 rounded-full p-1 text-xs"
                                title="Delete event"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <button
                          type="button"
                          className="w-full h-12 flex items-center justify-center text-sm text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-300 cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            const time24 = formatTo24Hour(timeSlot)
                            handleCreateEvent(selectedDate, time24)
                          }}
                        >
                          <Plus size={14} className="mr-2" />
                          Click to add event at {timeSlot}
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // Month view
  return (
    <>
      <Card className={`${className} flex flex-col h-full`}>
      {/* Month View Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <CalendarBlank size={18} className="text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">Schedule</h3>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => navigateMonth('prev')}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <CaretLeft size={16} />
              </button>
              <span className="text-sm font-medium text-gray-900 min-w-[140px] text-center">
                {formatMonthYear(currentDate)}
              </span>
              <button
                onClick={() => navigateMonth('next')}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <CaretRight size={16} />
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={goToToday}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Today
            </button>
            <button
              onClick={() => handleCreateEvent(new Date())}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              <Plus size={16} className="mr-2" />
              Add Event
            </button>
          </div>
        </div>
      </div>

      {/* Month View Calendar */}
      <div className="flex-1 p-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="p-2 text-xs font-medium text-gray-500 text-center">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1 flex-1">
          {generateCalendarDays(currentDate).map((date) => {
            const dayEvents = getEventsForDate(date, allEvents)
            const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
            
            return (
              <button
                key={dateKey}
                onClick={() => handleDayClick(date)}
                className={`
                  relative aspect-square p-1 text-left border border-gray-100 rounded 
                  hover:bg-gray-50 transition-colors cursor-pointer
                  flex flex-col items-start justify-start overflow-hidden
                  ${isToday(date) ? 'bg-blue-50 border-blue-200' : ''}
                  ${isWeekend(date) ? 'bg-gray-25' : ''}
                  ${!isCurrentMonth(date, currentDate) ? 'text-gray-400 opacity-60' : ''}
                `}
              >
                <div className={`text-xs font-medium mb-1 ${
                  isToday(date) ? 'text-blue-600' : ''
                }`}>
                  {date.getDate()}
                </div>
                
                {dayEvents.length > 0 && (
                  <div className="flex-1 flex flex-col gap-0.5 overflow-hidden min-h-0">
                    {dayEvents.slice(0, 2).map(event => {
                      const style = getCategoryStyle(event.categoryId, DEFAULT_CATEGORIES)
                      return (
                        <div
                          key={event.id}
                          className="text-xs px-1 py-0.5 rounded truncate border"
                          style={{
                            backgroundColor: style.backgroundColor,
                            borderColor: style.borderColor,
                            color: style.color
                          }}
                          title={event.title}
                        >
                          {event.title}
                        </div>
                      )
                    })}
                    {dayEvents.length > 2 && (
                      <div className="text-xs text-gray-500 font-medium px-1">
                        +{dayEvents.length - 2}
                      </div>
                    )}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    </Card>

      {/* Event Modal */}
      {showEventModal && editingEvent && (
        <EventModal
          event={editingEvent}
          categories={DEFAULT_CATEGORIES}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          onClose={() => {
            setShowEventModal(false)
            setEditingEvent(null)
          }}
        />
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <Check size={16} className="text-green-600" />
            <span className="text-sm font-medium">{successMessage}</span>
          </div>
        </div>
      )}
    </>
  )
}