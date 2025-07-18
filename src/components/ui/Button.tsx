/*
 * Button Component - Enterprise-grade Interactive Element
 * Physics-based micro-interactions with Phosphor Icons
 */

import type { Icon } from 'phosphor-react'
import React, { useState } from 'react'
import type { BaseComponentProps, Size, Variant, Elevation, IconWeight } from './types'

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'>, BaseComponentProps {
  variant?: Variant
  size?: Size
  icon?: Icon
  iconPosition?: 'left' | 'right'
  iconWeight?: IconWeight
  loading?: boolean
  fullWidth?: boolean
  elevation?: Elevation
  href?: string // For link-style buttons
}

// Sophisticated loading spinner component
const LoadingSpinner: React.FC = () => (
  <div className="relative">
    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current opacity-25" />
    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent absolute top-0 left-0" />
  </div>
)

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  iconWeight = 'regular',
  loading = false,
  fullWidth = false,
  elevation = 'sm',
  href,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false)

  // Enterprise icon weight mapping based on button variant
  const getIconWeight = (): IconWeight => {
    if (variant === 'primary') return 'bold'
    if (variant === 'secondary') return 'regular'
    if (variant === 'ghost') return 'light'
    return iconWeight
  }
  
  // Base styles with physics-based interactions
  const baseStyles = `
    relative inline-flex items-center justify-center font-medium
    transition-all duration-200 ease-[cubic-bezier(0.4,0.0,0.2,1)]
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
    transform active:scale-[0.98]
    ${fullWidth ? 'w-full' : 'min-w-[44px]'} // Touch-friendly minimum
    ${isPressed ? 'transform scale-[0.98]' : 'transform scale-100'}
  `

  // Enterprise variant styles with sophisticated gradients
  const variantStyles = {
    primary: `
      bg-gradient-to-r from-blue-600 to-blue-700 text-white border border-blue-600
      hover:from-blue-700 hover:to-blue-800 hover:border-blue-700
      active:from-blue-800 active:to-blue-900
      shadow-lg hover:shadow-xl
    `,
    secondary: `
      bg-white text-gray-700 border border-gray-300
      hover:bg-gray-50 hover:border-gray-400
      active:bg-gray-100
      shadow-sm hover:shadow-md
    `,
    success: `
      bg-gradient-to-r from-green-600 to-green-700 text-white border border-green-600
      hover:from-green-700 hover:to-green-800 hover:border-green-700
      active:from-green-800 active:to-green-900
      shadow-lg hover:shadow-xl
    `,
    warning: `
      bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border border-yellow-500
      hover:from-yellow-600 hover:to-yellow-700 hover:border-yellow-600
      active:from-yellow-700 active:to-yellow-800
      shadow-lg hover:shadow-xl
    `,
    danger: `
      bg-gradient-to-r from-red-600 to-red-700 text-white border border-red-600
      hover:from-red-700 hover:to-red-800 hover:border-red-700
      active:from-red-800 active:to-red-900
      shadow-lg hover:shadow-xl
    `,
    ghost: `
      bg-transparent text-gray-700 border border-transparent
      hover:bg-gray-100 hover:border-gray-200
      active:bg-gray-200
    `,
    outline: `
      bg-transparent text-blue-600 border border-blue-600
      hover:bg-blue-50 hover:border-blue-700 hover:text-blue-700
      active:bg-blue-100
      shadow-sm hover:shadow-md
    `
  }

  // Precision sizing with optical corrections
  const sizeStyles = {
    xs: 'px-2.5 py-1.5 text-xs rounded-md gap-1 min-h-[32px]',
    sm: 'px-3 py-2 text-sm rounded-md gap-1.5 min-h-[36px]',
    md: 'px-4 py-2.5 text-sm rounded-lg gap-2 min-h-[44px]',
    lg: 'px-6 py-3 text-base rounded-lg gap-2 min-h-[48px]',
    xl: 'px-8 py-4 text-lg rounded-xl gap-3 min-h-[56px]'
  }

  // Enterprise Phosphor icon sizing for premium consistency
  const iconSizes = {
    xs: 14,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 28
  }

  const buttonContent = (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {Icon && iconPosition === 'left' && (
            <Icon 
              size={iconSizes[size]} 
              weight={getIconWeight()} 
              className="flex-shrink-0" 
            />
          )}
          {children && <span className="truncate">{children}</span>}
          {Icon && iconPosition === 'right' && (
            <Icon 
              size={iconSizes[size]} 
              weight={getIconWeight()} 
              className="flex-shrink-0" 
            />
          )}
        </>
      )}
    </>
  )

  const buttonProps = {
    className: `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.replace(/\s+/g, ' ').trim(),
    disabled: disabled || loading,
    onMouseDown: () => setIsPressed(true),
    onMouseUp: () => setIsPressed(false),
    onMouseLeave: () => setIsPressed(false),
    'aria-busy': loading,
    'aria-disabled': disabled || loading,
    ...props
  }

  // Render as link if href provided
  if (href && !disabled && !loading) {
    return (
      <a href={href} {...buttonProps as any}>
        {buttonContent}
      </a>
    )
  }

  return (
    <button {...buttonProps}>
      {buttonContent}
    </button>
  )
}
