// Contact system TypeScript interfaces and types

export type ContactType = 'client' | 'service' | 'employee';

export interface Contact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  type: string; // Can be ContactType or any custom type
  company?: string;
  address?: string;
  website?: string;
  tags: string[];
  last_contact?: string;
  location_id: string;
  
  // Service provider specific fields
  service_types?: string[];
  rating?: number; // 0-5
  
  // Client specific fields
  rental_history_count?: number;
  preferred_vehicle_type?: string;
  last_rental_date?: string;
  
  // Employee specific fields
  department?: string;
  position?: string;
  hire_date?: string;
  
  // Common fields
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  expanded?: boolean; // For UI state management
}

export interface ContactFormData {
  name: string;
  email?: string;
  phone?: string;
  type: string;
  company?: string;
  address?: string;
  tags: string[];
  
  // Service provider fields
  service_types?: string[];
  hourly_rate?: number;
  rating?: number;
  
  // Client fields
  rental_history_count?: number;
  preferred_vehicle_type?: string;
  
  // Employee fields
  department?: string;
  position?: string;
  hire_date?: string;
  
  notes?: string;
}

export interface ContactFilters {
  search?: string;
  type?: string;
  tags?: string[];
  isActive?: boolean;
  company?: string;
  minRating?: number;
}

export interface ContactStats {
  total: number;
  active: number;
  inactive: number;
  byType: Record<string, number>;
  topTags: Array<{ tag: string; count: number }>;
  averageRating: number;
}

// Hook interface for contact operations
export interface UseContactsReturn {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  stats: ContactStats | null;
  customTypes: string[]; // User-defined contact types
  
  // CRUD operations
  createContact: (data: ContactFormData) => Promise<Contact>;
  updateContact: (id: string, data: Partial<ContactFormData>) => Promise<Contact>;
  deleteContact: (id: string) => Promise<void>;
  toggleContactStatus: (id: string) => Promise<Contact>;
  
  // Search and filter
  searchContacts: (query: string) => void;
  filterContacts: (filters: ContactFilters) => void;
  clearFilters: () => void;
  
  // Custom types management
  addCustomType: (typeName: string) => void;
  removeCustomType: (typeName: string) => void;
  
  // Bulk operations
  bulkUpdateTags: (contactIds: string[], tags: string[]) => Promise<void>;
  bulkStatusUpdate: (contactIds: string[], isActive: boolean) => Promise<void>;
  
  // Refresh data
  refetch: () => Promise<void>;
}

// Predefined default contact types (always available)
export const DEFAULT_CONTACT_TYPES: Array<{ value: ContactType; label: string; description: string; icon: string }> = [
  { value: 'client', label: 'Clients', description: 'Rental customers and prospects', icon: 'user-circle' },
  { value: 'service', label: 'Service Providers', description: 'Mechanics, maintenance, contractors', icon: 'wrench' },
  { value: 'employee', label: 'Employees', description: 'Company staff and team members', icon: 'users' },
];

export const COMMON_SERVICE_TYPES = [
  'Oil Change',
  'Brake Repair', 
  'Engine Diagnostics',
  'Tire Service',
  'Transmission Repair',
  'Air Conditioning',
  'Battery Service',
  'Towing',
  'Emergency Roadside',
  'Inspection',
  'Detailing',
  'Body Work',
];

export const COMMON_VEHICLE_TYPES = [
  'Sedan',
  'SUV', 
  'Truck',
  'Van',
  'Compact',
  'Luxury',
  'Electric',
  'Hybrid',
];

export const COMMON_TAGS = [
  'VIP',
  'Regular',
  'Corporate',
  'Trusted',
  'Fast Service',
  '24/7',
  'Emergency',
  'Reliable',
  'Parts',
  'Wholesale',
  'Fast Delivery',
  'Preferred',
];

export const COMMON_DEPARTMENTS = [
  'Operations',
  'Maintenance',
  'Customer Service',
  'Sales',
  'Administration',
  'Finance',
  'IT Support',
  'Fleet Management',
];
