/*
 * Spacing System - 8pt Grid with Golden Ratio Progressions
 * Mathematical precision for enterprise layouts
 */

export const spacing = {
  0: '0px',
  1: '4px',   // 0.25rem
  2: '8px',   // 0.5rem  (base unit)
  3: '12px',  // 0.75rem
  4: '16px',  // 1rem
  5: '20px',  // 1.25rem
  6: '24px',  // 1.5rem
  8: '32px',  // 2rem
  10: '40px', // 2.5rem
  12: '48px', // 3rem
  16: '64px', // 4rem
  20: '80px', // 5rem
  24: '96px', // 6rem
  32: '128px' // 8rem
} as const

export const borderRadius = {
  none: '0px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px'
} as const

export type Spacing = keyof typeof spacing
export type BorderRadius = keyof typeof borderRadius
