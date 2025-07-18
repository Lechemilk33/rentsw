/*
 * Shared Component Types - Enterprise Design System
 * Common interfaces and types for consistent component API
 */

import type { Icon } from 'phosphor-react'

// Base component props for consistency
export interface BaseComponentProps {
  className?: string
  'data-testid'?: string
}

// Common size variants
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

// Component variants with semantic meaning
export type Variant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'ghost' | 'outline'

// Elevation levels for depth hierarchy
export type Elevation = 'none' | 'sm' | 'md' | 'lg' | 'xl'

// Density patterns for information hierarchy
export type Density = 'compact' | 'comfortable' | 'spacious'

// Phosphor Icon weight system for premium visual hierarchy
export type IconWeight = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'

// Icon props for consistent Phosphor icon usage with enterprise standards
export interface IconProps {
  icon?: Icon
  iconPosition?: 'left' | 'right'
  iconWeight?: IconWeight
}

// Enhanced icon configuration for contextual usage
export interface IconConfig {
  icon: Icon
  weight: IconWeight
  size?: number
  className?: string
}

// Loading state interface
export interface LoadingState {
  loading?: boolean
}

// Common interaction states
export interface InteractionState {
  disabled?: boolean
  hover?: boolean
  active?: boolean
  focus?: boolean
}

// Form field common props
export interface FormFieldProps {
  label?: string
  error?: string
  helpText?: string
  required?: boolean
  fullWidth?: boolean
}
