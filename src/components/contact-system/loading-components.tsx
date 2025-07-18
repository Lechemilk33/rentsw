/**
 * Enterprise Loading Components
 * Professional skeleton loading states and indicators
 */

import React from 'react'

// Skeleton loading for contact cards
export function ContactCardSkeleton() {
  return (
    <div className="animate-pulse p-4 border border-gray-200 rounded-lg">
      {/* Avatar and name */}
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      
      {/* Contact info lines */}
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
      
      {/* Action buttons */}
      <div className="flex space-x-2 mt-4">
        <div className="h-8 bg-gray-200 rounded w-16"></div>
        <div className="h-8 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  )
}

// Skeleton for contact list
export function ContactListSkeleton({ count = 3 }: { count?: number }) {
  const skeletonIds = Array.from({ length: count }, (_, i) => `skeleton-item-${i}`)
  
  return (
    <div className="space-y-3">
      {skeletonIds.map((id) => (
        <ContactCardSkeleton key={id} />
      ))}
    </div>
  )
}

// Modern spinner component
export function Spinner({ 
  size = 'md',
  color = 'primary' 
}: { 
  size?: 'sm' | 'md' | 'lg'
  color?: 'primary' | 'neutral'
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  }
  
  const colorClasses = {
    primary: 'border-blue-500 border-t-transparent',
    neutral: 'border-gray-300 border-t-transparent'
  }
  
  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        ${colorClasses[color]}
        border-2 rounded-full animate-spin
      `}
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

// Loading overlay for full components
export function LoadingOverlay({ isLoading, children }: { 
  isLoading: boolean
  children: React.ReactNode 
}) {
  return (
    <div className="relative">
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center space-y-3">
            <Spinner size="lg" />
            <p className="text-sm text-gray-600">Loading contacts...</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Empty state component
export function EmptyState({ 
  icon: Icon,
  title,
  description,
  action
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <Icon size={48} className="text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 mb-6 max-w-sm">{description}</p>
      {action}
    </div>
  )
}

// Progress indicator for multi-step processes
export function ProgressIndicator({ 
  steps, 
  currentStep 
}: { 
  steps: string[]
  currentStep: number 
}) {
  return (
    <div className="flex items-center space-x-2">
      {steps.map((step, index) => {
        const isCompleted = index < currentStep
        const isCurrent = index === currentStep
        
        let stepClasses = 'bg-gray-100 text-gray-400'
        if (isCompleted) {
          stepClasses = 'bg-blue-500 text-white'
        } else if (isCurrent) {
          stepClasses = 'bg-blue-100 text-blue-600 border-2 border-blue-500'
        }
        
        return (
          <React.Fragment key={step}>
            <div 
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                ${stepClasses}
              `}
            >
              {isCompleted ? '✓' : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div 
                className={`
                  h-0.5 w-8
                  ${isCompleted ? 'bg-blue-500' : 'bg-gray-200'}
                `}
              />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}
