/**
 * Calendar Types and Interfaces for RENTAGAIN Dashboard
 */

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'
export type CalendarView = 'month' | 'day'

export interface CalendarCategory {
  id: string
  name: string
  color: string
  backgroundColor: string
  borderColor: string
  isDefault: boolean
}

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  date: Date
  startTime?: string
  endTime?: string
  type: 'maintenance' | 'custom' | 'booking' | 'delivery' | 'pickup' | 'swap' | 'wash' | 'task'
  categoryId: string
  maintenanceId?: string // Link to maintenance entries
  taskId?: string // Link to Supabase tasks table
  bookingId?: string // Link to Supabase bookings table
  isCompleted?: boolean
  priority?: TaskPriority
  vehicleId?: string | null
  assignedTo?: string | null
}

export interface MaintenanceTask {
  id: string
  vehicle_make: string
  vehicle_model: string
  vehicle_license_plate: string
  maintenance_type: 'routine' | 'emergency' | 'preventive' | 'inspection'
  work_performed: string
  date: string
  technician: string
  status?: 'scheduled' | 'in_progress' | 'completed'
}

export interface DashboardCalendarProps {
  className?: string
  maintenanceTasks?: MaintenanceTask[]
  onMaintenanceClick?: (taskId: string) => void
}

// Default calendar categories
export const DEFAULT_CATEGORIES: CalendarCategory[] = [
  {
    id: 'booking',
    name: 'Booking',
    color: '#059669',
    backgroundColor: '#d1fae5',
    borderColor: '#34d399',
    isDefault: true
  },
  {
    id: 'delivery',
    name: 'Delivery',
    color: '#7c3aed',
    backgroundColor: '#e9d5ff',
    borderColor: '#a855f7',
    isDefault: true
  },
  {
    id: 'pickup',
    name: 'Pick Up',
    color: '#ea580c',
    backgroundColor: '#fed7aa',
    borderColor: '#fb923c',
    isDefault: true
  },
  {
    id: 'swap',
    name: 'Swap',
    color: '#0891b2',
    backgroundColor: '#cffafe',
    borderColor: '#22d3ee',
    isDefault: true
  },
  {
    id: 'maintenance',
    name: 'Maintenance',
    color: '#dc2626',
    backgroundColor: '#fef2f2',
    borderColor: '#f87171',
    isDefault: true
  },
  {
    id: 'wash',
    name: 'Wash',
    color: '#2563eb',
    backgroundColor: '#dbeafe',
    borderColor: '#60a5fa',
    isDefault: true
  }
]
