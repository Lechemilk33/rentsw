/*
 * Maintenance Types - Database Schema Interfaces
 * Professional maintenance logging system types
 */

export interface MaintenanceEntry {
  id: string
  vehicle_id: string
  entry_date: string
  mileage: number
  maintenance_type: string
  work_performed: string
  parts_used: string[]
  labor_hours: number
  cost: number
  technician: string
  next_service_due: string
  next_service_mileage: number
  notes: string
  location_id: string
  created_at: string
  updated_at: string
  
  // Joined vehicle data for display
  vehicle?: {
    make: string
    model: string
    year: number
    license_plate: string
    vehicle_id: string
  }
}

export interface MaintenanceStats {
  totalEntries: number
  thisMonth: number
  totalCost: number
  avgCostPerEntry: number
  upcomingServices: number
}

export interface MaintenanceFilters {
  vehicleId: string | null
  maintenanceType: string
  startDate: string | null
  endDate: string | null
  searchQuery: string
}

export interface FilterState {
  searchQuery: string
  vehicleId: string
  maintenanceType: string
  dateRange: {
    start: string
    end: string
  }
  costRange: {
    min: number
    max: number
  }
  technicianId: string
}

export interface NewMaintenanceEntry {
  vehicle_id: string
  mileage: number
  maintenance_type: string
  work_performed: string
  parts_used: string[]
  labor_hours: number
  cost: number
  technician: string
  next_service_due: string
  next_service_mileage: number
  notes: string
}
