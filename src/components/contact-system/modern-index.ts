/**
 * Enterprise Contact System - Professional exports
 * Clean, accessible contact system with design system integration and business functionality
 */

export { ContactProvider } from './ModernContactProvider'
export { ModernContactFAB } from './ModernContactFAB'
export { EnhancedContactOverlay as ModernContactOverlay } from './EnhancedContactOverlay'
export { useContacts } from './ModernContactProvider'

// Export design system and utilities for advanced usage
export { designTokens } from './design-tokens'
export type { DesignTokens, ColorScale, SpacingScale, FontSize } from './design-tokens'

// Export accessibility utilities
export { 
  useFocusTrap, 
  useLiveAnnouncer, 
  getModalA11yProps, 
  useId 
} from './accessibility-utils'

// Export loading components
export { 
  ContactListSkeleton, 
  Spinner, 
  LoadingOverlay, 
  EmptyState 
} from './loading-components'

// Re-export types for convenience
export type { Contact, ContactType } from './types'
