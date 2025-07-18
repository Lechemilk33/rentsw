/*
 * Input Component - Professional Form Controls with Phosphor Icons
 * Enterprise-grade input with premium icon weight system
 */

import type { Icon } from 'phosphor-react'
import React, { useState, useEffect } from 'react'
import type { BaseComponentProps, Size, FormFieldProps, IconWeight } from './types'

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>, BaseComponentProps, FormFieldProps {
  icon?: Icon
  iconPosition?: 'left' | 'right'
  iconWeight?: IconWeight
  variant?: 'default' | 'filled' | 'outlined'
  size?: Size
  loading?: boolean
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helpText,
  icon: Icon,
  iconPosition = 'left',
  iconWeight = 'regular',
  fullWidth = false,
  variant = 'outlined',
  size = 'md',
  loading = false,
  className = '',
  id,
  value,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [hasValue, setHasValue] = useState(Boolean(value))
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`
  
  useEffect(() => {
    setHasValue(Boolean(value))
  }, [value])

  // Enterprise icon sizing for premium consistency  
  const getIconSize = (): number => {
    switch (size) {
      case 'xs': return 14
      case 'sm': return 16
      case 'md': return 20
      case 'lg': return 24
      case 'xl': return 28
      default: return 20
    }
  }

  const sizeStyles = {
    xs: 'px-3 py-2 text-xs',
    sm: 'px-3 py-2.5 text-sm', 
    md: 'px-4 py-3 text-sm',
    lg: 'px-4 py-3.5 text-base',
    xl: 'px-5 py-4 text-lg'
  }

  // Calculate icon padding
  let iconPadding = ''
  if (Icon) {
    iconPadding = iconPosition === 'left' ? 'pl-10' : 'pr-10'
  }

  // Calculate aria-describedby
  let ariaDescribedBy: string | undefined
  if (error) {
    ariaDescribedBy = `${inputId}-error`
  } else if (helpText) {
    ariaDescribedBy = `${inputId}-help`
  }
  
  const baseStyles = `
    block w-full rounded-lg border transition-all duration-200 ease-[cubic-bezier(0.4,0.0,0.2,1)]
    focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'}
    ${iconPadding}
    ${fullWidth ? 'w-full' : ''}
  `

  const variantStyles = {
    default: 'bg-white',
    filled: 'bg-gray-50 focus:bg-white',
    outlined: 'bg-transparent'
  }

  const labelStyles = `
    absolute left-4 transition-all duration-200 ease-[cubic-bezier(0.4,0.0,0.2,1)] pointer-events-none
    ${isFocused || hasValue 
      ? 'top-2 text-xs text-blue-600 font-medium' 
      : 'top-1/2 -translate-y-1/2 text-gray-500'
    }
    ${error && (isFocused || hasValue) ? 'text-red-600' : ''}
  `

  const iconStyles = `
    absolute top-1/2 transform -translate-y-1/2 text-gray-400
    ${iconPosition === 'left' ? 'left-3' : 'right-3'}
    ${loading ? 'animate-spin' : ''}
  `

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      <div className="relative">
        <input
          id={inputId}
          className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.replace(/\s+/g, ' ').trim()}
          onFocus={(e) => {
            setIsFocused(true)
            props.onFocus?.(e)
          }}
          onBlur={(e) => {
            setIsFocused(false)
            props.onBlur?.(e)
          }}
          onChange={(e) => {
            setHasValue(Boolean(e.target.value))
            props.onChange?.(e)
          }}
          value={value}
          placeholder={isFocused || !label ? props.placeholder : ''}
          aria-invalid={!!error}
          aria-describedby={ariaDescribedBy}
          {...props}
        />
        
        {/* Floating label */}
        {label && (
          <label htmlFor={inputId} className={labelStyles}>
            {label}
          </label>
        )}
        
        {/* Phosphor Icon with Enterprise Weight System */}
        {Icon && (
          <div className={iconStyles}>
            <Icon 
              size={getIconSize()} 
              weight={iconWeight} 
            />
          </div>
        )}
        
        {/* Loading spinner overlay */}
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent" />
          </div>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <p id={`${inputId}-error`} className="mt-2 text-sm text-red-600 flex items-center gap-1">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      
      {/* Help text */}
      {helpText && !error && (
        <p id={`${inputId}-help`} className="mt-2 text-sm text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  )
}
