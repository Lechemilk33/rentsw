/*
 * Enterprise Design System - Main Export
 * Modular, tree-shakeable component library with Phosphor Icons
 */

// Design Tokens
export * from './tokens'

// Phosphor Icon System
export * from './icons'

// Core Components
export { Button } from './Button'
export type { ButtonProps } from './Button'

export { Card } from './Card'
export type { CardProps } from './Card'

export { Badge } from './Badge'
export type { BadgeProps } from './Badge'

export { Input } from './Input'
export type { InputProps } from './Input'

export { Loading } from './Loading'
export type { LoadingProps } from './Loading'

// Shared Types (including IconWeight)
export * from './types'

// Backward compatibility - consolidated design tokens
export { designTokens } from './tokens'

// Import components for collection
import { Button } from './Button'
import { Card } from './Card'
import { Badge } from './Badge'
import { Input } from './Input'
import { Loading } from './Loading'

// Component collection for convenience
export const EnterpriseUI = {
  Button,
  Card,
  Badge,
  Input,
  Loading
} as const
