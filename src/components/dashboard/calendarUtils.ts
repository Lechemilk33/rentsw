/**
 * Calendar Utility Functions for RENTAGAIN Dashboard
 */

import type { CalendarEvent, CalendarCategory, TaskPriority } from './CalendarTypes'

// Helper function to get next hour for event end time
export const getNextHour = (startTime: string): string => {
  const [hours, minutes] = startTime.split(':').map(Number)
  const nextHour = (hours + 1) % 24
  return `${nextHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

// Helper function to get priority color class
export const getPriorityColor = (priority: string) => {
  if (priority === 'urgent') return 'bg-red-500'
  if (priority === 'high') return 'bg-orange-500'
  if (priority === 'medium') return 'bg-yellow-500'
  return 'bg-green-500'
}

// Get category styling for events
export const getCategoryStyle = (categoryId: string, categories: CalendarCategory[]) => {
  const category = categories.find(c => c.id === categoryId)
  if (!category) return { backgroundColor: '#f3f4f6', borderColor: '#d1d5db', color: '#374151' }
  
  return {
    backgroundColor: category.backgroundColor,
    borderColor: category.borderColor,
    color: category.color
  }
}

// Generate time slots for day view (12-hour format) - Starting at 8 AM
export const generateTimeSlots = () => {
  const slots = []
  for (let hour = 8; hour < 22; hour++) {
    const time24 = `${hour.toString().padStart(2, '0')}:00`
    const time12 = formatTo12Hour(time24)
    slots.push(time12)
    
    const timeHalf24 = `${hour.toString().padStart(2, '0')}:30`
    const timeHalf12 = formatTo12Hour(timeHalf24)
    slots.push(timeHalf12)
  }
  return slots
}

// Convert 24-hour time to 12-hour format
export const formatTo12Hour = (time24: string): string => {
  const [hours, minutes] = time24.split(':').map(Number)
  const period = hours >= 12 ? 'PM' : 'AM'
  const hours12 = hours % 12 || 12
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`
}

// Convert 12-hour time to 24-hour format for database storage
export const formatTo24Hour = (time12: string): string => {
  const [time, period] = time12.split(' ')
  const [hours, minutes] = time.split(':').map(Number)
  let hours24 = hours
  
  if (period === 'PM' && hours !== 12) {
    hours24 += 12
  } else if (period === 'AM' && hours === 12) {
    hours24 = 0
  }
  
  return `${hours24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
}

// Generate calendar days for month view
export const generateCalendarDays = (currentDate: Date) => {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const days = []
  const current = new Date(startDate)
  
  while (current <= lastDay || current.getDay() !== 0) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
    if (days.length > 42) break // Prevent infinite loop
  }
  
  return days
}

// Date helper functions
export const formatMonthYear = (date: Date) => {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export const isToday = (date: Date) => {
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

export const isWeekend = (date: Date) => {
  const day = date.getDay()
  return day === 0 || day === 6
}

export const isCurrentMonth = (date: Date, currentDate: Date) => {
  return date.getMonth() === currentDate.getMonth()
}

// Get events for a specific date
export const getEventsForDate = (date: Date, events: CalendarEvent[]) => {
  return events.filter(event => 
    event.date.toDateString() === date.toDateString()
  )
}

// Process task data into calendar events
export const processTasksIntoEvents = (tasks: any[]): CalendarEvent[] => {
  return tasks.map(task => {
    const dueDate = task.due_date ? new Date(task.due_date) : new Date(task.created_at || new Date())
    return {
      id: `task-${task.id}`,
      title: task.title,
      description: task.description || '',
      date: dueDate,
      startTime: task.due_date ? dueDate.toTimeString().slice(0, 5) : undefined,
      type: 'task',
      categoryId: 'booking', // Default category for tasks
      taskId: task.id,
      priority: task.priority as TaskPriority,
      vehicleId: task.vehicle_id || undefined,
      assignedTo: task.assigned_to || undefined,
      isCompleted: task.status === 'completed'
    }
  })
}
