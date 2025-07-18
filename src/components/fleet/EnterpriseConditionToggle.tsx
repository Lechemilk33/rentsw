/*
 * Enterprise Condition Toggle Component
 * Professional wash status toggle with enhanced UX and accessibility
 */

import React from 'react'
import { Sparkle, Drop } from 'phosphor-react'

interface EnterpriseConditionToggleProps {
  isClean: boolean
  isUpdating: boolean
  onToggle: () => void
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const EnterpriseConditionToggle: React.FC<EnterpriseConditionToggleProps> = ({
  isClean,
  isUpdating,
  onToggle,
  size = 'md',
  className = ''
}) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      padding: 'px-2.5 py-1',
      text: 'text-xs',
      icon: 12,
      gap: 'gap-1.5'
    },
    md: {
      padding: 'px-3 py-1.5',
      text: 'text-sm', 
      icon: 14,
      gap: 'gap-2'
    },
    lg: {
      padding: 'px-4 py-2',
      text: 'text-base',
      icon: 16,
      gap: 'gap-2.5'
    }
  }

  const sizeStyles = sizeConfig[size]

  // Professional condition states
  const conditionConfig = isClean ? {
    label: 'Clean',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-800',
    borderColor: 'border-emerald-200',
    hoverBg: 'hover:bg-emerald-100',
    hoverBorder: 'hover:border-emerald-300',
    icon: Sparkle,
    iconColor: 'text-emerald-600'
  } : {
    label: 'Needs Wash',
    bgColor: 'bg-orange-50', 
    textColor: 'text-orange-800',
    borderColor: 'border-orange-200',
    hoverBg: 'hover:bg-orange-100',
    hoverBorder: 'hover:border-orange-300',
    icon: Drop,
    iconColor: 'text-orange-600'
  }

  const IconComponent = conditionConfig.icon

  if (isUpdating) {
    return (
      <div 
        className={`
          inline-flex items-center font-medium rounded-full border
          ${sizeStyles.padding} ${sizeStyles.text} ${sizeStyles.gap}
          bg-gray-50 text-gray-600 border-gray-200
          ${className}
        `}
        aria-label="Updating wash status"
      >
        <div className="w-3.5 h-3.5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        <span>Updating...</span>
      </div>
    )
  }

  return (
    <button
      onClick={onToggle}
      className={`
        inline-flex items-center font-medium rounded-full border
        ${sizeStyles.padding} ${sizeStyles.text} ${sizeStyles.gap}
        ${conditionConfig.bgColor} ${conditionConfig.textColor} ${conditionConfig.borderColor}
        ${conditionConfig.hoverBg} ${conditionConfig.hoverBorder}
        transition-all duration-200 ease-in-out
        hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${className}
      `}
      aria-label={`Mark as ${isClean ? 'needs wash' : 'clean'}`}
      title={`Click to mark as ${isClean ? 'needs wash' : 'clean'}`}
    >
      <IconComponent 
        size={sizeStyles.icon} 
        weight="fill"
        className={conditionConfig.iconColor}
      />
      <span>{conditionConfig.label}</span>
    </button>
  )
}
