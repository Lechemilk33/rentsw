/**
 * Enterprise Accessibility Utilities
 * Professional accessibility helpers for inclusive design
 */

import React, { useEffect, useRef, useCallback } from 'react'

// Focus trap hook for modals
export function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    const container = containerRef.current
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    // Focus first element when trap activates
    firstElement?.focus()

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleTabKey)
    return () => document.removeEventListener('keydown', handleTabKey)
  }, [isActive])

  return containerRef
}

// Live region announcements for screen readers
export function useLiveAnnouncer() {
  const announceRef = useRef<HTMLDivElement>(null)

  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (!announceRef.current) return

    announceRef.current.setAttribute('aria-live', priority)
    announceRef.current.textContent = message

    // Clear after announcement
    setTimeout(() => {
      if (announceRef.current) {
        announceRef.current.textContent = ''
      }
    }, 1000)
  }, [])

  const LiveRegion = useCallback(() => (
    React.createElement('div', {
      ref: announceRef,
      'aria-live': 'polite',
      'aria-atomic': 'true',
      className: 'sr-only'
    })
  ), [])

  return { announce, LiveRegion }
}

// Accessible modal props generator
export function getModalA11yProps(isOpen: boolean, titleId: string, descriptionId?: string) {
  return {
    role: 'dialog' as const,
    'aria-modal': true,
    'aria-labelledby': titleId,
    'aria-describedby': descriptionId,
    'aria-hidden': !isOpen
  }
}

// Screen reader only text utility
export const srOnlyClasses = 'sr-only absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0'

// Generate unique IDs for accessibility
let idCounter = 0
export function useId(prefix = 'id') {
  const id = useRef<string | undefined>(undefined)
  if (!id.current) {
    id.current = `${prefix}-${++idCounter}`
  }
  return id.current
}

// Keyboard navigation helper
export function useKeyboardNavigation(
  onEnter?: () => void,
  onEscape?: () => void,
  onArrowUp?: () => void,
  onArrowDown?: () => void
) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    switch (e.key) {
      case 'Enter':
        e.preventDefault()
        onEnter?.()
        break
      case 'Escape':
        e.preventDefault()
        onEscape?.()
        break
      case 'ArrowUp':
        e.preventDefault()
        onArrowUp?.()
        break
      case 'ArrowDown':
        e.preventDefault()
        onArrowDown?.()
        break
    }
  }, [onEnter, onEscape, onArrowUp, onArrowDown])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])
}

// Accessible button props
export function getButtonA11yProps(
  label: string,
  disabled = false,
  pressed?: boolean,
  expanded?: boolean
) {
  return {
    'aria-label': label,
    'aria-disabled': disabled,
    'aria-pressed': pressed,
    'aria-expanded': expanded,
    role: 'button',
    tabIndex: disabled ? -1 : 0
  }
}
