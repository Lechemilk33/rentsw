/*
 * Shadow & Animation System - Realistic Depth and Physics-based Motion
 * Enterprise-grade elevation and micro-interactions
 */

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
} as const

export const animation = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms'
  },
  easing: {
    // Spring physics curves - not linear
    spring: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0.0, 1, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  }
} as const

export type Shadow = keyof typeof shadows
export type AnimationDuration = keyof typeof animation.duration
export type AnimationEasing = keyof typeof animation.easing
