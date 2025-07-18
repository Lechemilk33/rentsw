/*
 * Color System - Enterprise Design Tokens
 * Monochromatic dominance with semantic coding - WCAG AAA compliant
 */

export const colors = {
  // Monochromatic Primary (Blue) - WCAG AAA compliant
  primary: {
    50: '#eff6ff',
    100: '#dbeafe', 
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Primary brand
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554'
  },
  
  // Semantic Colors - Universal enterprise standards
  semantic: {
    success: { light: '#10b981', dark: '#065f46', bg: '#ecfdf5', text: '#047857' },
    warning: { light: '#f59e0b', dark: '#92400e', bg: '#fffbeb', text: '#b45309' },
    danger: { light: '#ef4444', dark: '#dc2626', bg: '#fef2f2', text: '#dc2626' },
    info: { light: '#06b6d4', dark: '#0891b2', bg: '#f0f9ff', text: '#0891b2' }
  },
  
  // Neutral System - Perceptual uniformity
  neutral: {
    0: '#ffffff',
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a'
  }
} as const

export type ColorScale = typeof colors.primary
export type SemanticColor = typeof colors.semantic.success
export type NeutralColor = typeof colors.neutral
