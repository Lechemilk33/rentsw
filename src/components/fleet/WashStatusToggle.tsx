/*
 * WashStatusToggle Component - Professional Red/Green Toggle
 * Clean wash status button with enhanced styling and feedback
 */

import React from 'react'

interface WashStatusToggleProps {
  isWashed: boolean
  isUpdating: boolean
  onToggle: () => void
  className?: string
}

export const WashStatusToggle: React.FC<WashStatusToggleProps> = ({
  isWashed,
  isUpdating,
  onToggle,
  className = ''
}) => {
  return (
    <button
      onClick={() => !isUpdating && onToggle()}
      disabled={isUpdating}
      className={`
        inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium 
        transition-all duration-200 w-16 h-8
        ${isUpdating 
          ? 'opacity-50 cursor-not-allowed bg-gray-100 text-gray-400 border border-gray-200' 
          : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
        }
        ${className}
      `}
      aria-label={`Mark as ${isWashed ? 'needs wash' : 'washed'}`}
    >
      {isUpdating ? (
        <div className="w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
      ) : (
        <>
          <div className={`w-2 h-2 rounded-full ${isWashed ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span>{isWashed ? 'Clean' : 'Dirty'}</span>
        </>
      )}
    </button>
  )
}
