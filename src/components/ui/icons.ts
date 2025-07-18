/*
 * Enterprise Icon System - Phosphor Icons Integration
 * Fleet-specific icon mapping with enterprise weight standards
 */

import {
  // Fleet & Vehicle Icons
  Car,
  Wrench,
  Warning,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  
  // Navigation & Dashboard
  ChartBar,
  Gear,
  SquaresFour,
  Calendar,
  MapPin,
  
  // Actions & Status
  Play,
  Pause,
  Stop
} from 'phosphor-react'

import type { IconWeight } from './types'

/**
 * Fleet-Specific Icon Configuration
 * Semantic icon mapping with contextual weights for enterprise consistency
 */
export const FleetIcons = {
  // Vehicle Status Icons with Semantic Weights
  vehicleAvailable: { icon: Car, weight: 'fill' as IconWeight, semantic: 'success' },
  vehicleRented: { icon: Car, weight: 'bold' as IconWeight, semantic: 'info' },
  vehicleMaintenance: { icon: Wrench, weight: 'bold' as IconWeight, semantic: 'warning' },
  vehicleOutOfService: { icon: XCircle, weight: 'fill' as IconWeight, semantic: 'danger' },
  
  // Action Icons with Contextual Weights
  primaryAction: { icon: Play, weight: 'bold' as IconWeight, semantic: 'primary' },
  secondaryAction: { icon: Pause, weight: 'regular' as IconWeight, semantic: 'secondary' },
  dangerAction: { icon: Stop, weight: 'fill' as IconWeight, semantic: 'danger' },
  
  // Status Indicators with Fill Weight for Prominence
  success: { icon: CheckCircle, weight: 'fill' as IconWeight, semantic: 'success' },
  warning: { icon: Warning, weight: 'fill' as IconWeight, semantic: 'warning' },
  error: { icon: XCircle, weight: 'fill' as IconWeight, semantic: 'danger' },
  pending: { icon: Clock, weight: 'regular' as IconWeight, semantic: 'info' },
  
  // Navigation with Bold Weight for Clarity
  dashboard: { icon: SquaresFour, weight: 'bold' as IconWeight, semantic: 'navigation' },
  analytics: { icon: ChartBar, weight: 'bold' as IconWeight, semantic: 'navigation' },
  settings: { icon: Gear, weight: 'bold' as IconWeight, semantic: 'navigation' },
  
  // Supporting Elements with Light Weight
  calendar: { icon: Calendar, weight: 'light' as IconWeight, semantic: 'supporting' },
  location: { icon: MapPin, weight: 'light' as IconWeight, semantic: 'supporting' },
  users: { icon: Users, weight: 'light' as IconWeight, semantic: 'supporting' }
} as const

/**
 * Enterprise Icon Weight Standards
 * Consistent visual hierarchy through systematic weight usage
 */
export const IconWeightStandards = {
  // Primary Elements - Maximum Visual Impact
  primary: 'fill' as IconWeight,      // Selected states, active status, critical alerts
  
  // Interactive Elements - Strong Presence
  interactive: 'bold' as IconWeight,   // Navigation, primary actions, buttons
  
  // Standard Elements - Balanced Visibility
  standard: 'regular' as IconWeight,   // Default UI elements, form fields
  
  // Supporting Elements - Subtle Presence
  supporting: 'light' as IconWeight,   // Secondary information, helpers
  
  // Decorative Elements - Minimal Presence
  decorative: 'thin' as IconWeight,    // Subtle dividers, background elements
  
  // Premium Treatment - Sophisticated Depth
  premium: 'duotone' as IconWeight     // Special emphasis, premium features
} as const

/**
 * Contextual Icon Size Standards
 * 8px grid system alignment for enterprise consistency
 */
export const IconSizeStandards = {
  xs: 16,   // Small buttons, badges, inline elements
  sm: 20,   // Standard buttons, form fields
  md: 24,   // Card headers, navigation items
  lg: 32,   // Feature highlights, dashboard cards
  xl: 48,   // Hero sections, empty states
  xxl: 64   // Brand elements, loading screens
} as const

/**
 * Icon Color Mapping
 * Semantic color system for consistent meaning
 */
export const IconColorMap = {
  success: 'text-green-600',
  warning: 'text-yellow-600', 
  danger: 'text-red-600',
  info: 'text-blue-600',
  primary: 'text-gray-900',
  secondary: 'text-gray-600',
  navigation: 'text-gray-700',
  supporting: 'text-gray-500'
} as const

/**
 * Fleet Status Color System
 * Vehicle-specific semantic colors
 */
export const FleetStatusColors = {
  available: 'text-green-600',      // Available vehicles
  rented: 'text-blue-600',          // Currently rented
  maintenance: 'text-yellow-600',   // Under maintenance
  outOfService: 'text-red-600',     // Out of service
  pending: 'text-gray-600'          // Pending status
} as const

// Type exports for TypeScript support
export type FleetIconKey = keyof typeof FleetIcons
export type IconWeightKey = keyof typeof IconWeightStandards
export type IconSizeKey = keyof typeof IconSizeStandards
export type IconColorKey = keyof typeof IconColorMap
export type FleetStatusKey = keyof typeof FleetStatusColors

/**
 * Helper function to get fleet icon configuration
 */
export const getFleetIcon = (key: FleetIconKey) => FleetIcons[key]

/**
 * Helper function to get semantic color for icon
 */
export const getSemanticColor = (semantic: IconColorKey) => IconColorMap[semantic]

/**
 * Example Usage:
 * 
 * import { FleetIcons, getFleetIcon, IconSizeStandards } from '@/components/ui/icons'
 * 
 * const { icon: CarIcon, weight, semantic } = getFleetIcon('vehicleAvailable')
 * 
 * <CarIcon 
 *   size={IconSizeStandards.md} 
 *   weight={weight} 
 *   className={getSemanticColor(semantic)} 
 * />
 */
