/*
 * Card Component - Sophisticated Container with Phosphor Icons
 * Apple-level polish with enterprise icon weight system
 */

import type { Icon } from 'phosphor-react'
import React from 'react'
import type { BaseComponentProps, Elevation, IconWeight } from './types'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, BaseComponentProps {
  variant?: 'default' | 'elevated' | 'interactive' | 'outlined'
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  elevation?: Elevation
  hover?: boolean
  gradient?: boolean
  headerIcon?: Icon
  iconWeight?: IconWeight
  title?: string
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  elevation = 'sm',
  hover = false,
  gradient = false,
  headerIcon: HeaderIcon,
  iconWeight,
  title,
  children,
  className = '',
  ...props
}) => {
  // Enterprise icon weight based on card variant for premium visual hierarchy
  const getIconWeight = (): IconWeight => {
    if (iconWeight) return iconWeight
    
    switch (variant) {
      case 'interactive': return 'bold'
      case 'elevated': return 'regular'
      case 'outlined': return 'light'
      default: return 'regular'
    }
  }
  const baseStyles = `
    relative bg-white border rounded-xl transition-all duration-300 ease-[cubic-bezier(0.4,0.0,0.2,1)]
    ${hover ? 'cursor-pointer' : ''}
    ${gradient ? 'bg-gradient-to-br from-white to-gray-50' : ''}
  `

  const variantStyles = {
    default: `
      border-gray-200 shadow-sm
      ${hover ? 'hover:shadow-lg hover:-translate-y-1' : ''}
    `,
    elevated: `
      border-gray-200 shadow-lg
      ${hover ? 'hover:shadow-xl hover:-translate-y-1' : ''}
    `,
    interactive: `
      border-gray-200 shadow-md cursor-pointer
      hover:shadow-xl hover:-translate-y-1 hover:border-blue-300
      active:transform active:scale-[0.99]
    `,
    outlined: `
      border-gray-300 shadow-none bg-transparent
      ${hover ? 'hover:border-blue-400 hover:shadow-md' : ''}
    `
  }

  const paddingStyles = {
    none: '',
    xs: 'p-3',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  }

  const elevationStyles = {
    none: 'shadow-none',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl'
  }

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${elevationStyles[elevation]} ${className}`.replace(/\s+/g, ' ').trim()}
      {...props}
    >
      {(HeaderIcon || title) && (
        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100">
          {HeaderIcon && (
            <HeaderIcon 
              size={24} 
              weight={getIconWeight()} 
              className="text-gray-600 flex-shrink-0" 
            />
          )}
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {title}
            </h3>
          )}
        </div>
      )}
      {children}
    </div>
  )
}
