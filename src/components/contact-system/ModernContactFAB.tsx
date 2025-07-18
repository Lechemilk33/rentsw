/**
 * Enterprise Contact FAB
 * Professional floating action button with design system integration and accessibility
 */

import React from 'react'
import { AddressBook } from 'phosphor-react'
import { useContacts } from './ModernContactProvider'
import { designTokens } from './design-tokens'
import { getButtonA11yProps } from './accessibility-utils'

export function ModernContactFAB() {
  const { isOpen, openContactBook } = useContacts()

  return (
    <button
      onClick={openContactBook}
      className="
        fixed w-16 h-16
        bg-gradient-to-br from-blue-500 to-blue-600
        hover:from-blue-600 hover:to-blue-700
        active:from-blue-700 active:to-blue-800
        text-white rounded-full shadow-lg hover:shadow-xl
        transition-all duration-300 ease-out
        transform hover:scale-110 active:scale-95
        flex items-center justify-center group
        ring-4 ring-blue-500/20 ring-offset-2 ring-offset-white
        z-50
      "
      style={{ 
        bottom: designTokens.spacing.lg,
        right: designTokens.spacing.lg,
        zIndex: designTokens.zIndex.fixed
      }}
      {...getButtonA11yProps('Open contact book', false, undefined, isOpen)}
    >
      <AddressBook 
        size={28} 
        weight="duotone"
        className="
          transition-all duration-300 ease-out relative z-10
          group-hover:scale-110 drop-shadow-sm
        "
      />
      
      {/* Inner glow effect */}
      <div className="absolute inset-2 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Ripple effect on click */}
      <div className="absolute inset-0 rounded-full bg-white opacity-0 group-active:opacity-30 group-active:scale-110 transition-all duration-150" />
    </button>
  )
}
