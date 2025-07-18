/*
 * Enterprise Design System - Fleet Management
 * World-class design tokens following Fortune 500 standards
 */

export const fleetDesignSystem = {
  // Typography Scale - Following Major 3rd (1.25) ratio
  typography: {
    scale: {
      xs: '0.75rem',      // 12px
      sm: '0.875rem',     // 14px  
      base: '1rem',       // 16px
      lg: '1.125rem',     // 18px
      xl: '1.25rem',      // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
    },
    weight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    leading: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.625',
    }
  },

  // Spacing System - 4px base unit
  spacing: {
    px: '1px',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    3.5: '0.875rem',  // 14px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    8: '2rem',        // 32px
    10: '2.5rem',     // 40px
    12: '3rem',       // 48px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
  },

  // Color System - Semantic and accessible
  colors: {
    // Brand Primary - Professional Blue
    primary: {
      50: '#eff6ff',
      100: '#dbeafe', 
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',  // Main brand
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },

    // Status Colors - Semantic meaning
    status: {
      available: {
        bg: '#f0fdf4',
        border: '#bbf7d0', 
        text: '#166534',
        dot: '#22c55e'
      },
      inUse: {
        bg: '#eff6ff',
        border: '#bfdbfe',
        text: '#1e40af', 
        dot: '#3b82f6'
      },
      maintenance: {
        bg: '#fefce8',
        border: '#fde68a',
        text: '#a16207',
        dot: '#eab308'
      },
      offline: {
        bg: '#f9fafb',
        border: '#d1d5db',
        text: '#374151',
        dot: '#6b7280'
      }
    },

    // Neutral Scale - Carefully calibrated
    neutral: {
      0: '#ffffff',
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },

    // Condition States
    condition: {
      clean: {
        bg: '#f0fdf4',
        border: '#bbf7d0',
        text: '#166534',
        dot: '#22c55e'
      },
      needsWash: {
        bg: '#fff7ed',
        border: '#fed7aa',
        text: '#c2410c',
        dot: '#f97316'
      }
    }
  },

  // Shadows - Depth hierarchy
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },

  // Border Radius
  radius: {
    none: '0',
    sm: '0.125rem',  // 2px
    base: '0.25rem', // 4px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    '2xl': '1rem',   // 16px
    full: '9999px',
  },

  // Animation Durations
  animation: {
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms',
  },

  // Focus Ring
  focus: {
    ring: '0 0 0 2px rgba(59, 130, 246, 0.5)',
    offset: '2px',
  }
} as const

export type FleetDesignSystem = typeof fleetDesignSystem
