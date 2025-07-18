/**
 * Enterprise Contact System Provider
 * Professional contact management with design system integration and accessibility
 */

import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react'
import type { Contact } from './types'
import { useLiveAnnouncer } from './accessibility-utils'

interface ContactState {
  contacts: Contact[]
  isOpen: boolean
  selectedContact: Contact | null
  searchQuery: string
  loading: boolean
  error: string | null
}

interface ContactActions {
  openContactBook: () => void
  closeContactBook: () => void
  selectContact: (contact: Contact | null) => void
  setSearchQuery: (query: string) => void
  setContacts: (contacts: Contact[]) => void
  addContact: (contact: Contact) => void
  updateContact: (contact: Contact) => void
  deleteContact: (id: string) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

type ContactContextType = ContactState & ContactActions

const ContactContext = createContext<ContactContextType | null>(null)

type ContactAction = 
  | { type: 'OPEN_CONTACT_BOOK' }
  | { type: 'CLOSE_CONTACT_BOOK' }
  | { type: 'SELECT_CONTACT'; payload: Contact | null }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_CONTACTS'; payload: Contact[] }
  | { type: 'ADD_CONTACT'; payload: Contact }
  | { type: 'UPDATE_CONTACT'; payload: Contact }
  | { type: 'DELETE_CONTACT'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }

const initialState: ContactState = {
  contacts: [],
  isOpen: false,
  selectedContact: null,
  searchQuery: '',
  loading: false,
  error: null
}

function contactReducer(state: ContactState, action: ContactAction): ContactState {
  switch (action.type) {
    case 'OPEN_CONTACT_BOOK':
      return { ...state, isOpen: true }
    case 'CLOSE_CONTACT_BOOK':
      return { ...state, isOpen: false, selectedContact: null, searchQuery: '' }
    case 'SELECT_CONTACT':
      return { ...state, selectedContact: action.payload }
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload }
    case 'SET_CONTACTS':
      return { ...state, contacts: action.payload }
    case 'ADD_CONTACT':
      return { ...state, contacts: [...state.contacts, action.payload] }
    case 'UPDATE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.map(c => c.id === action.payload.id ? action.payload : c),
        selectedContact: state.selectedContact?.id === action.payload.id ? action.payload : state.selectedContact
      }
    case 'DELETE_CONTACT':
      return {
        ...state,
        contacts: state.contacts.filter(c => c.id !== action.payload),
        selectedContact: state.selectedContact?.id === action.payload ? null : state.selectedContact
      }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    default:
      return state
  }
}

interface ContactProviderProps {
  children: React.ReactNode
}

export function ContactProvider({ children }: ContactProviderProps) {
  const [state, dispatch] = useReducer(contactReducer, initialState)
  const { announce } = useLiveAnnouncer()

  // Load contacts - using mock data for now since contacts table doesn't exist yet
  useEffect(() => {
    async function loadContacts() {
      try {
        dispatch({ type: 'SET_LOADING', payload: true })
        announce('Loading contacts...')
        
        // Mock contact data for demo
        const mockContacts: Contact[] = [
          {
            id: '1',
            name: 'John Smith',
            email: 'john.smith@email.com',
            phone: '(555) 123-4567',
            type: 'client',
            company: 'Tech Solutions Inc',
            address: '123 Main St, City, ST 12345',
            tags: ['VIP', 'Frequent Renter'],
            location_id: 'test-location-uuid',
            rental_history_count: 15,
            preferred_vehicle_type: 'SUV',
            last_rental_date: '2024-01-15',
            notes: 'Prefers luxury vehicles, always pays on time',
            is_active: true,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-15T00:00:00Z'
          },
          {
            id: '2',
            name: 'Sarah Johnson',
            email: 'sarah.j@company.com',
            phone: '(555) 987-6543',
            type: 'service',
            company: 'Auto Repair Pro',
            address: '456 Service Rd, City, ST 12345',
            tags: ['Mechanic', 'Emergency Service'],
            location_id: 'test-location-uuid',
            service_types: ['Engine Repair', 'Brake Service', 'Oil Change'],
            hourly_rate: 85,
            rating: 4.8,
            notes: 'Excellent mechanic, available for emergency repairs',
            is_active: true,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-10T00:00:00Z'
          },
          {
            id: '3',
            name: 'Mike Wilson',
            email: 'mike.wilson@company.com',
            phone: '(555) 456-7890',
            type: 'employee',
            company: 'RENTAGAIN',
            address: '789 Office Blvd, City, ST 12345',
            tags: ['Manager', 'Full-time'],
            location_id: 'test-location-uuid',
            department: 'Operations',
            position: 'Fleet Manager',
            hire_date: '2023-06-01',
            notes: 'Oversees daily fleet operations',
            is_active: true,
            created_at: '2023-06-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z'
          }
        ]
        
        dispatch({ type: 'SET_CONTACTS', payload: mockContacts })
        announce(`Loaded ${mockContacts.length} contacts`)
      } catch (error) {
        console.error('Error loading contacts:', error)
        const errorMessage = 'Failed to load contacts'
        dispatch({ type: 'SET_ERROR', payload: errorMessage })
        announce(errorMessage)
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    }

    loadContacts()
  }, [])

  // Simplified keyboard handling - only Enter for forms and Escape to close
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      // Escape to close contact book
      if (event.key === 'Escape' && state.isOpen) {
        event.preventDefault()
        if (state.selectedContact) {
          actions.selectContact(null)
          announce('Closed contact details')
        } else {
          actions.closeContactBook()
          announce('Closed contact book')
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [state.isOpen, state.selectedContact])

  const actions: ContactActions = {
    openContactBook: () => {
      dispatch({ type: 'OPEN_CONTACT_BOOK' })
      announce('Opened contact book')
    },
    closeContactBook: () => dispatch({ type: 'CLOSE_CONTACT_BOOK' }),
    selectContact: (contact) => {
      dispatch({ type: 'SELECT_CONTACT', payload: contact })
      if (contact) {
        announce(`Selected contact: ${contact.name}`)
      }
    },
    setSearchQuery: (query) => dispatch({ type: 'SET_SEARCH_QUERY', payload: query }),
    setContacts: (contacts) => dispatch({ type: 'SET_CONTACTS', payload: contacts }),
    addContact: (contact) => {
      dispatch({ type: 'ADD_CONTACT', payload: contact })
      announce(`Added new contact: ${contact.name}`)
    },
    updateContact: (contact) => {
      dispatch({ type: 'UPDATE_CONTACT', payload: contact })
      announce(`Updated contact: ${contact.name}`)
    },
    deleteContact: (id) => {
      const contact = state.contacts.find(c => c.id === id)
      dispatch({ type: 'DELETE_CONTACT', payload: id })
      if (contact) {
        announce(`Deleted contact: ${contact.name}`)
      }
    },
    setLoading: (loading) => dispatch({ type: 'SET_LOADING', payload: loading }),
    setError: (error) => dispatch({ type: 'SET_ERROR', payload: error })
  }

  const contextValue: ContactContextType = useMemo(() => ({
    ...state,
    ...actions
  }), [state])

  return (
    <ContactContext.Provider value={contextValue}>
      {children}
    </ContactContext.Provider>
  )
}

export function useContacts() {
  const context = useContext(ContactContext)
  if (!context) {
    throw new Error('useContacts must be used within a ContactProvider')
  }
  return context
}
