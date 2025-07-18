/*
 * Badge Component - Status Indicators with Phosphor Icons
 * Premium status display with enterprise icon weight system
 */

import type { Icon } from 'phosphor-react'
import React from 'react'
import type { BaseComponentProps, Size, IconWeight } from './types'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, BaseComponentProps {
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: Size
  icon?: Icon
  iconWeight?: IconWeight
  pulse?: boolean
  removable?: boolean
  onRemove?: () => void
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  icon: Icon,
  iconWeight,
  pulse = false,
  removable = false,
  onRemove,
  children,
  className = '',
  ...props
}) => {
  // Enterprise icon weight mapping for premium visual hierarchy
  const getIconWeight = (): IconWeight => {
    if (iconWeight) return iconWeight
    
    // Semantic weight based on badge variant for enterprise standards
    switch (variant) {
      case 'primary': return 'fill'
      case 'success': return 'fill'
      case 'warning': return 'bold'
      case 'danger': return 'fill'
      case 'info': return 'regular'
      default: return 'regular'
    }
  }

  // Premium icon sizing aligned with 8px grid system
  const getIconSize = (): number => {
    switch (size) {
      case 'xs': return 12
      case 'sm': return 14
      case 'md': return 16
      case 'lg': return 18
      case 'xl': return 20
      default: return 16
    }
  }
  const baseStyles = `
    inline-flex items-center font-medium rounded-full transition-all duration-200
    ${pulse ? 'animate-pulse' : ''}
  `

  const variantStyles = {
    default: 'bg-gray-100 text-gray-800 border border-gray-200',
    primary: 'bg-blue-100 text-blue-800 border border-blue-200',
    success: 'bg-green-100 text-green-800 border border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    danger: 'bg-red-100 text-red-800 border border-red-200',
    info: 'bg-cyan-100 text-cyan-800 border border-cyan-200'
  }

  const sizeStyles = {
    xs: 'px-2 py-0.5 text-xs gap-1',
    sm: 'px-2.5 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-sm gap-1.5',
    lg: 'px-3.5 py-2 text-sm gap-2',
    xl: 'px-4 py-2.5 text-base gap-2'
  }

  return (
    <span
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.replace(/\s+/g, ' ').trim()}
      {...props}
    >
      {Icon && (
        <Icon 
          size={getIconSize()} 
          weight={getIconWeight()} 
          className="flex-shrink-0" 
        />
      )}
      {children && <span className="truncate">{children}</span>}
      
      {removable && onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="ml-1 flex-shrink-0 text-current hover:text-gray-600 transition-colors"
          aria-label="Remove badge"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      )}
    </span>
  )
}
