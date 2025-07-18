/*
 * Design Tokens - Consolidated Export
 * Central hub for all design system tokens
 */

import { colors } from './colors'
import { typography } from './typography'
import { spacing, borderRadius } from './spacing'
import { shadows, animation } from './shadows'

export { colors } from './colors'
export { typography } from './typography'
export { spacing, borderRadius } from './spacing'
export { shadows, animation } from './shadows'

// Re-export types
export type {
  ColorScale,
  SemanticColor,
  NeutralColor
} from './colors'

export type {
  FontSize,
  FontWeight,
  FontFamily
} from './typography'

export type {
  Spacing,
  BorderRadius
} from './spacing'

export type {
  Shadow,
  AnimationDuration,
  AnimationEasing
} from './shadows'

// Consolidated design tokens object for backward compatibility
export const designTokens = {
  colors: colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animation
} as const
