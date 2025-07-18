/*
 * Loading Component - Sophisticated Loading States
 * Enterprise-grade loading indicators with skeleton screens
 */

import React from 'react'
import type { BaseComponentProps, Size } from './types'

export interface LoadingProps extends BaseComponentProps {
  size?: Size
  variant?: 'spinner' | 'skeleton'
  text?: string
  overlay?: boolean
  fullScreen?: boolean
}

export const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  variant = 'spinner', 
  text,
  overlay = false,
  fullScreen = false,
  className = ''
}) => {
  const sizeStyles = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  }

  const renderLoader = () => {
    if (variant === 'skeleton') {
      return (
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      )
    }

    return (
      <div className="relative">
        <div className={`animate-spin rounded-full border-2 border-gray-200 ${sizeStyles[size]}`} />
        <div className={`animate-spin rounded-full border-2 border-blue-600 border-t-transparent absolute top-0 left-0 ${sizeStyles[size]}`} />
      </div>
    )
  }

  const containerClasses = `
    flex flex-col items-center justify-center space-y-3
    ${fullScreen ? 'fixed inset-0 bg-white/80 backdrop-blur-sm z-50' : ''}
    ${overlay ? 'absolute inset-0 bg-white/80 backdrop-blur-sm' : ''}
    ${className}
  `

  return (
    <div className={containerClasses.replace(/\s+/g, ' ').trim()}>
      {renderLoader()}
      {text && (
        <p className={`text-gray-600 font-medium ${textSizes[size]}`}>
          {text}
        </p>
      )}
    </div>
  )
}
