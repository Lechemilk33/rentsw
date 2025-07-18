/**
 * Enterprise Contact Overlay
 * Professional contact interface with accessibility, design system integration, and business functionality
 */

import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { 
  X, 
  MagnifyingGlass, 
  Plus,
  User,
  Phone,
  Envelope,
  MapPin,
  Tag,
  Star,
  Car,
  CalendarPlus,
  Heart,
  Wrench,
  Globe
} from 'phosphor-react'
import { useContacts } from './ModernContactProvider'
import type { Contact } from './types'
import { designTokens } from './design-tokens'
import { 
  useFocusTrap, 
  getModalA11yProps, 
  useId,
  useLiveAnnouncer
} from './accessibility-utils'
import { ContactListSkeleton, EmptyState } from './loading-components'
import { NewContactForm } from './NewContactForm'

// Helper Components
function ContactTypeBadge({ type }: { type: string }) {
  let badgeClasses = 'bg-gray-100 text-gray-800 border-gray-200'
  
  if (type === 'client') {
    badgeClasses = 'bg-green-100 text-green-800 border-green-200'
  } else if (type === 'service') {
    badgeClasses = 'bg-orange-100 text-orange-800 border-orange-200'
  } else if (type === 'employee') {
    badgeClasses = 'bg-blue-100 text-blue-800 border-blue-200'
  }

  return (
    <span className={`inline-block px-2 py-1 text-xs rounded-full border font-medium ${badgeClasses}`}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  )
}

function TagBadge({ tag }: { tag: string }) {
  let tagClasses = 'bg-gray-100 text-gray-700 border-gray-200'
  
  if (tag.includes('Emergency') || tag.includes('Urgent')) {
    tagClasses = 'bg-red-100 text-red-700 border-red-200'
  } else if (tag.includes('Manager') || tag.includes('Supervisor')) {
    tagClasses = 'bg-blue-100 text-blue-700 border-blue-200'
  } else if (tag.includes('VIP') || tag.includes('Premium')) {
    tagClasses = 'bg-purple-100 text-purple-700 border-purple-200'
  }

  return (
    <span className={`px-2 py-1 text-xs rounded-md ${tagClasses}`}>
      {tag}
    </span>
  )
}

export function EnhancedContactOverlay() {
  const { 
    isOpen, 
    closeContactBook, 
    contacts, 
    searchQuery, 
    setSearchQuery,
    selectedContact,
    selectContact,
    loading 
  } = useContacts()

  const [activeFilter, setActiveFilter] = useState<'all' | 'clients' | 'service' | 'employees'>('all')
  const [showNewContactForm, setShowNewContactForm] = useState(false)
  
  // Accessibility
  const overlayRef = useFocusTrap(isOpen) as React.RefObject<HTMLDivElement>
  const { announce } = useLiveAnnouncer()
  const titleId = useId('contact-overlay-title')
  const descriptionId = useId('contact-overlay-description')

  if (!isOpen) return null

  // Business-focused filtering
  const getFilteredContacts = () => {
    let filtered = contacts

    // Apply type filter
    if (activeFilter !== 'all') {
      filtered = filtered.filter(contact => contact.type === activeFilter)
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.phone?.includes(searchQuery) ||
        contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contact.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Business priority sorting: emergency services first, then managers, then alphabetical
    return filtered.sort((a, b) => {
      const aUrgent = a.tags?.includes('Emergency Service') || a.tags?.includes('Urgent')
      const bUrgent = b.tags?.includes('Emergency Service') || b.tags?.includes('Urgent')
      
      if (aUrgent && !bUrgent) return -1
      if (!aUrgent && bUrgent) return 1
      return a.name.localeCompare(b.name)
    })
  }

  const getContactTypeColor = (type: string) => {
    switch (type) {
      case 'client': return 'bg-green-100 text-green-800 border-green-200'
      case 'service': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'employee': return 'bg-blue-100 text-blue-800 border-blue-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'client': return User
      case 'service': return Wrench
      case 'employee': return User
      default: return User
    }
  }

  const getContactPriority = (contact: Contact) => {
    if (contact.tags?.includes('Emergency Service')) return 'urgent'
    if (contact.tags?.includes('Manager') || contact.tags?.includes('Supervisor')) return 'high'
    return 'normal'
  }

  const filteredContacts = getFilteredContacts()

  const handleContactAction = (action: string) => {
    if (!selectedContact) return

    switch (action) {
      case 'call':
        if (selectedContact.phone) {
          window.open(`tel:${selectedContact.phone}`)
          announce(`Calling ${selectedContact.name}`)
        }
        break
      case 'email':
        if (selectedContact.email) {
          window.open(`mailto:${selectedContact.email}`)
          announce(`Opening email to ${selectedContact.name}`)
        }
        break
      case 'schedule':
        // Integration point for scheduling system
        announce(`Opening schedule for ${selectedContact.name}`)
        break
      case 'book_service':
        // Integration point for service booking
        announce(`Booking service with ${selectedContact.name}`)
        break
    }
  }

  return createPortal(
    <>
      <div 
        className="fixed inset-0 flex items-center justify-center p-4"
        style={{ zIndex: designTokens.zIndex.modal }}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 backdrop-blur-sm transition-all duration-300 ease-out opacity-100"
          style={{ 
            backgroundColor: 'rgba(17, 24, 39, 0.25)',
          }}
          onClick={closeContactBook}
        />
        
        {/* Modal Container */}
        <div 
          ref={overlayRef}
          className="relative w-full max-w-6xl h-[85vh] bg-white rounded-xl shadow-2xl transform transition-all duration-300 ease-out scale-100 opacity-100 border border-gray-200"
          style={{ 
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          }}
          role="dialog"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div>
              <h2 id={titleId} className="text-2xl font-bold text-gray-900">
                Enterprise Contact Directory
              </h2>
              <p id={descriptionId} className="text-sm text-gray-600 mt-1">
                Manage your business contacts, clients, and service providers
              </p>
            </div>
            <button
              onClick={closeContactBook}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Close contact directory"
            >
              <X size={24} />
            </button>
          </div>

          {/* Main Content */}
          <div className="flex h-full">
            {/* Contact List */}
            <div className="w-1/3 border-r border-gray-200 flex flex-col">
              {/* Search and Filters */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="relative mb-4">
                  <MagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search contacts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex space-x-2">
                  {(['all', 'clients', 'service', 'employees'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setActiveFilter(filter)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        activeFilter === filter
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
                
                <button
                  onClick={() => setShowNewContactForm(true)}
                  className="w-full mt-3 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                  data-add-contact-trigger
                >
                  <Plus size={18} />
                  <span>Add Contact</span>
                </button>
              </div>

              {/* Contact List */}
              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <ContactListSkeleton />
                ) : filteredContacts.length === 0 ? (
                  <div className="p-6">
                    <EmptyState
                      icon={User}
                      title="No contacts found"
                      description="Try adjusting your search or filters to find contacts."
                      action={
                        <button 
                          onClick={() => setShowNewContactForm(true)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Add First Contact
                        </button>
                      }
                    />
                  </div>
                ) : (
                  <div className="space-y-1 p-2">
                    {filteredContacts.map((contact: Contact) => {
                      const priority = getContactPriority(contact)
                      const IconComponent = getContactIcon(contact.type)
                      
                      let priorityClasses = 'border-gray-200 bg-white hover:bg-gray-50'
                      if (priority === 'high') {
                        priorityClasses = 'border-red-200 bg-red-50'
                      } else if (priority === 'urgent') {
                        priorityClasses = 'border-orange-200 bg-orange-50'
                      }
                      
                      return (
                        <button
                          key={contact.id}
                          onClick={() => selectContact(contact)}
                          className={`w-full text-left p-3 rounded-lg border transition-all duration-200 ${priorityClasses} ${
                            selectedContact?.id === contact.id 
                              ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50' 
                              : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="p-2 rounded-lg bg-gray-100">
                              <IconComponent size={18} className="text-gray-600" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-medium text-gray-900 truncate">{contact.name}</h3>
                                <ContactTypeBadge type={contact.type} />
                              </div>
                              
                              {contact.company && (
                                <p className="text-sm text-gray-600 truncate mb-1">{contact.company}</p>
                              )}
                              
                              <div className="flex items-center space-x-2 text-xs text-gray-500">
                                {contact.phone && (
                                  <span className="flex items-center space-x-1">
                                    <Phone size={12} />
                                    <span>{contact.phone}</span>
                                  </span>
                                )}
                                {contact.email && (
                                  <span className="flex items-center space-x-1">
                                    <Envelope size={12} />
                                    <span className="truncate">{contact.email}</span>
                                  </span>
                                )}
                              </div>
                              
                              {contact.tags && contact.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {contact.tags.slice(0, 2).map((tag) => (
                                    <TagBadge key={tag} tag={tag} />
                                  ))}
                                  {contact.tags.length > 2 && (
                                    <span className="text-xs text-gray-500">+{contact.tags.length - 2} more</span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Contact Details */}
            <div className="flex-1 flex flex-col">
              {selectedContact ? (
                <div className="h-full overflow-y-auto">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 rounded-xl bg-blue-100">
                          {React.createElement(getContactIcon(selectedContact.type), { 
                            size: 32, 
                            className: "text-blue-600" 
                          })}
                        </div>
                        <div>
                          <h1 className="text-2xl font-bold text-gray-900">{selectedContact.name}</h1>
                          {selectedContact.company && (
                            <p className="text-lg text-gray-600">{selectedContact.company}</p>
                          )}
                          <ContactTypeBadge type={selectedContact.type} />
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        {selectedContact.phone && (
                          <button
                            onClick={() => handleContactAction('call')}
                            className="p-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                            title="Call contact"
                          >
                            <Phone size={20} />
                          </button>
                        )}
                        {selectedContact.email && (
                          <button
                            onClick={() => handleContactAction('email')}
                            className="p-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                            title="Email contact"
                          >
                            <Envelope size={20} />
                          </button>
                        )}
                        <button
                          onClick={() => handleContactAction('schedule')}
                          className="p-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                          title="Schedule meeting"
                        >
                          <CalendarPlus size={20} />
                        </button>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                        <div className="space-y-3">
                          {selectedContact.phone && (
                            <div className="flex items-center space-x-3">
                              <Phone size={18} className="text-gray-400" />
                              <span className="text-gray-700">{selectedContact.phone}</span>
                            </div>
                          )}
                          {selectedContact.email && (
                            <div className="flex items-center space-x-3">
                              <Envelope size={18} className="text-gray-400" />
                              <span className="text-gray-700">{selectedContact.email}</span>
                            </div>
                          )}
                          {selectedContact.address && (
                            <div className="flex items-start space-x-3">
                              <MapPin size={18} className="text-gray-400 mt-0.5" />
                              <span className="text-gray-700">{selectedContact.address}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Details</h3>
                        <div className="space-y-3">
                          {selectedContact.company && (
                            <div className="flex items-center space-x-3">
                              <Globe size={18} className="text-gray-400" />
                              <span className="text-gray-700">{selectedContact.company}</span>
                            </div>
                          )}
                          {selectedContact.position && (
                            <div className="flex items-center space-x-3">
                              <User size={18} className="text-gray-400" />
                              <span className="text-gray-700">{selectedContact.position}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Tags */}
                    {selectedContact.tags && selectedContact.tags.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedContact.tags.map((tag) => (
                            <TagBadge key={tag} tag={tag} />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {selectedContact.notes && (
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Notes</h3>
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <User size={64} className="text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No contact selected</h3>
                    <p className="text-gray-600">Choose a contact from the list to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* New Contact Form Modal */}
      <NewContactForm 
        isOpen={showNewContactForm}
        onClose={() => setShowNewContactForm(false)}
      />
    </>,
    document.body
  )
}
