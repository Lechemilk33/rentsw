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
  let tagClasses = 'bg-gray-100 text-gray-700'
  
  if (tag === 'Emergency Service') {
    tagClasses = 'bg-orange-100 text-orange-700'
  } else if (tag === 'Manager' || tag === 'Supervisor') {
    tagClasses = 'bg-red-100 text-red-700'
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
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(contact =>
        contact.name.toLowerCase().includes(query) ||
        contact.email?.toLowerCase().includes(query) ||
        contact.phone?.includes(query) ||
        contact.company?.toLowerCase().includes(query) ||
        contact.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Sort by priority: Important contacts first, then by name
    return filtered.sort((a, b) => {
      // Emergency/urgent contacts first
      const aUrgent = a.tags.includes('Emergency Service') || a.tags.includes('Manager')
      const bUrgent = b.tags.includes('Emergency Service') || b.tags.includes('Manager')
      if (aUrgent && !bUrgent) return -1
      if (!aUrgent && bUrgent) return 1
      return a.name.localeCompare(b.name)
    })
  }

  const filteredContacts = getFilteredContacts()

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
    if (contact.tags.includes('Emergency Service')) return 'urgent'
    if (contact.tags.includes('Manager') || contact.tags.includes('Supervisor')) return 'high'
    return 'normal'
  }

  // Business actions with real functionality
  const handleCall = (phone: string) => {
    // In a real app, this could integrate with a phone system
    if (navigator.userAgent.includes('Mobile')) {
      window.location.href = `tel:${phone}`
    } else {
      window.open(`tel:${phone}`)
    }
    announce(`Calling ${phone}`)
  }

  const handleEmail = (email: string) => {
    const subject = encodeURIComponent('Fleet Rental Inquiry')
    const body = encodeURIComponent('Hello,\n\nI am reaching out regarding our fleet rental services.\n\nBest regards,\nRENTAGAIN Team')
    window.open(`mailto:${email}?subject=${subject}&body=${body}`)
    announce(`Opening email to ${email}`)
  }

  const handleCreateBooking = () => {
    // Navigate to booking creation with pre-filled customer info
    if (selectedContact) {
      announce(`Opening booking form for ${selectedContact.name}`)
      // Implementation: This would navigate to your booking page with customer data
      // Example: router.push('/bookings/new', { state: { customer: selectedContact } })
      console.log('Navigate to booking creation with customer:', selectedContact)
    }
  }

  const handleScheduleService = () => {
    // Navigate to service scheduling with pre-filled provider info
    if (selectedContact) {
      announce(`Opening service scheduling with ${selectedContact.name}`)
      // Implementation: This would navigate to your service scheduling page
      // Example: router.push('/services/schedule', { state: { provider: selectedContact } })
      console.log('Navigate to service scheduling with provider:', selectedContact)
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
            backdropFilter: 'blur(4px) saturate(1.8)'
          }}
          onClick={closeContactBook}
          aria-hidden="true"
        />
        
        {/* Main Container */}
        <div 
          ref={overlayRef}
          className="relative w-full max-w-6xl h-[700px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden"
          {...getModalA11yProps(isOpen, titleId, descriptionId)}
        >
          {selectedContact ? (
            // Contact Detail View
            <ContactDetailView 
              contact={selectedContact} 
              onBack={() => selectContact(null)}
              onCall={handleCall}
              onEmail={handleEmail}
              onCreateBooking={handleCreateBooking}
              onScheduleService={handleScheduleService}
              titleId={titleId}
            />
          ) : (
            // Contact List View
            <ContactListView 
              filteredContacts={filteredContacts}
              loading={loading}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              selectContact={selectContact}
              closeContactBook={closeContactBook}
              getContactTypeColor={getContactTypeColor}
              getContactIcon={getContactIcon}
              getContactPriority={getContactPriority}
              titleId={titleId}
              descriptionId={descriptionId}
              onAddContact={() => setShowNewContactForm(true)}
            />
          )}
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

// Contact List Content Component
function ContactListContent({ 
  filteredContacts, 
  selectContact, 
  getContactTypeColor, 
  getContactIcon, 
  getContactPriority 
}: any) {
  if (filteredContacts.length === 0) {
    return (
      <EmptyState
        icon={User}
        title="No contacts found"
        description="Try adjusting your search or filters to find contacts."
        action={
          <button 
            onClick={() => {
              // Get access to the parent component's onAddContact function
              const addContactBtn = document.querySelector('[data-add-contact-trigger]') as HTMLButtonElement
              if (addContactBtn) {
                addContactBtn.click()
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add First Contact
          </button>
        }
      />
    )
  }

  return (
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
            className={`w-full text-left p-4 rounded-lg border transition-all hover:shadow-md hover:border-blue-200 ${priorityClasses}`}
            aria-label={`View details for ${contact.name}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getContactTypeColor(contact.type)}`}>
                  <IconComponent size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-medium text-gray-900 truncate">{contact.name}</h3>
                    {(contact.tags.includes('Emergency Service') || contact.tags.includes('Manager')) && (
                      <Star size={14} className="text-red-500 fill-current" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">{contact.company || contact.email}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-block px-2 py-0.5 text-xs rounded-full border ${getContactTypeColor(contact.type)}`}>
                      {contact.type}
                    </span>
                    {contact.tags.length > 0 && (
                      <span className="text-xs text-gray-500">
                        +{contact.tags.length} tag{contact.tags.length > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {/* Business Intelligence Preview */}
              <div className="text-right text-xs text-gray-500">
                {contact.type === 'client' && contact.rental_history_count && (
                  <div>{contact.rental_history_count} rentals</div>
                )}
                {contact.type === 'service' && contact.rating && (
                  <div className="flex items-center space-x-1">
                    <Star size={12} className="text-yellow-500 fill-current" />
                    <span>{contact.rating}</span>
                  </div>
                )}
                {contact.type === 'employee' && contact.department && (
                  <div className="text-blue-600 font-medium">{contact.department}</div>
                )}
              </div>
            </div>
          </button>
        )
      })}
    </div>
  )
}

// Contact List View Component
function ContactListView({ 
  filteredContacts, 
  loading, 
  searchQuery, 
  setSearchQuery, 
  activeFilter, 
  setActiveFilter, 
  selectContact,
  closeContactBook,
  getContactTypeColor,
  getContactIcon,
  getContactPriority,
  titleId,
  descriptionId,
  onAddContact
}: any) {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
            <User size={20} className="text-white" weight="duotone" />
          </div>
          <div>
            <h2 id={titleId} className="text-xl font-semibold text-gray-900">Business Contacts</h2>
            <p id={descriptionId} className="text-sm text-gray-600">{filteredContacts.length} contacts • Fleet Management</p>
          </div>
        </div>
        <button
          onClick={closeContactBook}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Close contact book"
        >
          <X size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Search and Filters */}
      <div className="p-6 border-b border-gray-100 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <MagnifyingGlass size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search contacts, companies, or services..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            aria-label="Search contacts"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'all', label: 'All', icon: User },
            { key: 'clients', label: 'Clients', icon: User },
            { key: 'service', label: 'Service', icon: Wrench },
            { key: 'employees', label: 'Team', icon: User }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key as any)}
              className={`flex-1 flex items-center justify-center space-x-1 py-1.5 px-2 text-xs font-medium rounded-md transition-all ${
                activeFilter === key 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              aria-pressed={activeFilter === key}
            >
              <Icon size={14} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Add Contact Button */}
      <div className="p-3 border-b border-gray-100">
        <button
          data-add-contact-trigger
          onClick={onAddContact}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
        >
          <Plus size={16} />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Contact List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4">
            <ContactListSkeleton count={5} />
          </div>
        ) : (
          <ContactListContent 
            filteredContacts={filteredContacts}
            selectContact={selectContact}
            getContactTypeColor={getContactTypeColor}
            getContactIcon={getContactIcon}
            getContactPriority={getContactPriority}
          />
        )}
      </div>
    </>
  )
}

// Contact Detail View Component
function ContactDetailView({ 
  contact, 
  onBack, 
  onCall, 
  onEmail, 
  onCreateBooking, 
  onScheduleService,
  titleId 
}: any) {
  const { updateContact } = useContacts()
  const [isEditing, setIsEditing] = useState(false)
  const [editedContact, setEditedContact] = useState({ ...contact })
  const [newTag, setNewTag] = useState('')

  // Helper function to render website link
  const renderWebsite = (website: string | undefined) => {
    if (!website) {
      return <span className="text-gray-500 italic">No website</span>
    }
    return (
      <a 
        href={website.startsWith('http') ? website : `https://${website}`}
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-700 underline"
      >
        {website}
      </a>
    )
  }
  const [showTagInput, setShowTagInput] = useState(false)

  const handleSave = () => {
    updateContact(editedContact)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedContact({ ...contact })
    setIsEditing(false)
  }

  const handleFieldChange = (field: string, value: any) => {
    setEditedContact((prev: Contact) => ({ ...prev, [field]: value }))
  }

  const addTag = () => {
    if (newTag.trim() && !editedContact.tags.includes(newTag.trim())) {
      setEditedContact((prev: Contact) => ({ 
        ...prev, 
        tags: [...prev.tags, newTag.trim()] 
      }))
      setNewTag('')
      setShowTagInput(false)
    }
  }

  const removeTag = (tagToRemove: string) => {
    setEditedContact((prev: Contact) => ({ 
      ...prev, 
      tags: prev.tags.filter((tag: string) => tag !== tagToRemove) 
    }))
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          aria-label="Back to contact list"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back</span>
        </button>
        <h2 id={titleId} className="text-lg font-semibold text-gray-900">Contact Details</h2>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Save
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Contact Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center">
              <User size={32} className="text-white" weight="duotone" />
            </div>
            <div>
              <div className="flex items-center space-x-2 mb-1">
                {isEditing ? (
                  <input
                    type="text"
                    value={editedContact.name}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    className="text-2xl font-bold text-gray-900 border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-gray-900">{contact.name}</h1>
                )}
                {contact.tags.includes('VIP') && (
                  <Heart size={20} className="text-red-500 fill-current" />
                )}
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={editedContact.company || ''}
                  onChange={(e) => handleFieldChange('company', e.target.value)}
                  className="text-gray-600 border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
                  placeholder="Company name"
                />
              ) : (
                <p className="text-gray-600">{contact.company}</p>
              )}
              <div className="flex items-center space-x-2 mt-2">
                <ContactTypeBadge type={contact.type} />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex space-x-2">
            {contact.phone && (
              <button
                onClick={() => onCall(contact.phone!)}
                className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                title={`Call ${contact.phone}`}
                aria-label={`Call ${contact.phone}`}
              >
                <Phone size={16} />
              </button>
            )}
            {contact.email && (
              <button
                onClick={() => onEmail(contact.email!)}
                className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                title={`Email ${contact.email}`}
                aria-label={`Email ${contact.email}`}
              >
                <Envelope size={16} />
              </button>
            )}
            {contact.type === 'client' && (
              <button
                onClick={onCreateBooking}
                className="p-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
                title="Create booking"
                aria-label="Create new booking"
              >
                <CalendarPlus size={16} />
              </button>
            )}
            {contact.type === 'service' && (
              <button
                onClick={onScheduleService}
                className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                title="Schedule service"
                aria-label="Schedule service appointment"
              >
                <Wrench size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div className="p-6 space-y-6 overflow-y-auto">
        {/* Contact Information */}
        <div className="grid grid-cols-1 gap-4">
          {/* Email Field */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <Envelope size={18} className="text-gray-400" />
              {isEditing ? (
                <input
                  type="email"
                  value={editedContact.email || ''}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  className="flex-1 text-gray-700 border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
                  placeholder="Email address"
                />
              ) : (
                <span className="text-gray-700">{contact.email}</span>
              )}
            </div>
            {!isEditing && contact.email && (
              <button
                onClick={() => onEmail(contact.email!)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Send Email
              </button>
            )}
          </div>

          {/* Phone Field */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <Phone size={18} className="text-gray-400" />
              {isEditing ? (
                <input
                  type="tel"
                  value={editedContact.phone || ''}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  className="flex-1 text-gray-700 border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
                  placeholder="Phone number"
                />
              ) : (
                <span className="text-gray-700">{contact.phone}</span>
              )}
            </div>
            {!isEditing && contact.phone && (
              <button
                onClick={() => onCall(contact.phone!)}
                className="text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Call Now
              </button>
            )}
          </div>

          {/* Address Field */}
          <div className="flex items-center space-x-3">
            <MapPin size={18} className="text-gray-400" />
            {isEditing ? (
              <input
                type="text"
                value={editedContact.address || ''}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                className="flex-1 text-gray-700 border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
                placeholder="Address"
              />
            ) : (
              <span className="text-gray-700">{contact.address}</span>
            )}
          </div>

          {/* Department Field (Employees only) */}
          {(contact.type === 'employee' || (isEditing && editedContact.type === 'employee')) && (
            <div className="flex items-center space-x-3">
              <User size={18} className="text-gray-400" />
              {isEditing ? (
                <input
                  type="text"
                  value={editedContact.department || ''}
                  onChange={(e) => handleFieldChange('department', e.target.value)}
                  className="flex-1 text-gray-700 border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
                  placeholder="Department"
                />
              ) : (
                <span className="text-gray-700">{contact.department}</span>
              )}
            </div>
          )}

          {/* Position Field (Employees only) */}
          {(contact.type === 'employee' || (isEditing && editedContact.type === 'employee')) && (
            <div className="flex items-center space-x-3">
              <User size={18} className="text-gray-400" />
              {isEditing ? (
                <input
                  type="text"
                  value={editedContact.position || ''}
                  onChange={(e) => handleFieldChange('position', e.target.value)}
                  className="flex-1 text-gray-700 border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
                  placeholder="Position/Title"
                />
              ) : (
                <span className="text-gray-700">{contact.position}</span>
              )}
            </div>
          )}

          {/* Website Field (Service providers only) */}
          {(contact.type === 'service' || (isEditing && editedContact.type === 'service')) && (
            <div className="flex items-center space-x-3">
              <Globe size={18} className="text-gray-400" />
              {isEditing ? (
                <input
                  type="url"
                  value={editedContact.website || ''}
                  onChange={(e) => handleFieldChange('website', e.target.value)}
                  className="flex-1 text-gray-700 border-b border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent"
                  placeholder="Website URL"
                />
              ) : (
                renderWebsite(contact.website)
              )}
            </div>
          )}
        </div>

        {/* Tags Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Tag size={18} className="text-gray-400" />
              <h4 className="text-sm font-medium text-gray-900">Tags</h4>
            </div>
            <button
              onClick={() => setShowTagInput(true)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              + Add Tag
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {editedContact.tags.map((tag: string) => (
              <div key={tag} className="flex items-center">
                <TagBadge tag={tag} />
                {isEditing && (
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-red-500 hover:text-red-700"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add Tag Input */}
          {showTagInput && (
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addTag()
                  } else if (e.key === 'Escape') {
                    setNewTag('')
                    setShowTagInput(false)
                  }
                }}
                className="flex-1 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                placeholder="Enter tag name"
                autoFocus
              />
              <button
                onClick={addTag}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setNewTag('')
                  setShowTagInput(false)
                }}
                className="px-3 py-1 text-gray-600 hover:text-gray-900 text-sm"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* Notes Section */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
          {isEditing ? (
            <textarea
              value={editedContact.notes || ''}
              onChange={(e) => handleFieldChange('notes', e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              rows={4}
              placeholder="Add notes about this contact..."
            />
          ) : (
            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
              {contact.notes || 'No notes available'}
            </p>
          )}
        </div>

        {/* Business Intelligence Cards - Read Only */}
        {contact.type === 'client' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CalendarPlus size={16} className="text-green-600" />
                <h4 className="text-sm font-medium text-green-900">Rental History</h4>
              </div>
              <p className="text-2xl font-bold text-green-900">{contact.rental_history_count || 0}</p>
              <p className="text-sm text-green-700">Total rentals</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Car size={16} className="text-blue-600" />
                <h4 className="text-sm font-medium text-blue-900">Preferred Vehicle</h4>
              </div>
              <p className="text-lg font-semibold text-blue-900">{contact.preferred_vehicle_type || 'Any'}</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <CalendarPlus size={16} className="text-purple-600" />
                <h4 className="text-sm font-medium text-purple-900">Last Rental</h4>
              </div>
              <p className="text-sm font-medium text-purple-900">
                {contact.last_rental_date ? new Date(contact.last_rental_date).toLocaleDateString() : 'Never'}
              </p>
            </div>
          </div>
        )}

        {contact.type === 'service' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Star size={16} className="text-orange-600" />
                <h4 className="text-sm font-medium text-orange-900">Rating</h4>
              </div>
              <p className="text-2xl font-bold text-orange-900">{contact.rating || 'N/A'}</p>
              <p className="text-sm text-orange-700">Average rating</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Wrench size={16} className="text-blue-600" />
                <h4 className="text-sm font-medium text-blue-900">Services</h4>
              </div>
              <p className="text-lg font-semibold text-blue-900">{contact.service_types?.length || 0}</p>
              <p className="text-sm text-blue-700">Available services</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Globe size={16} className="text-green-600" />
                <h4 className="text-sm font-medium text-green-900">Website</h4>
              </div>
              <p className="text-sm font-medium text-green-900 break-all">
                {contact.website ? (
                  <a
                    href={contact.website.startsWith('http') ? contact.website : `https://${contact.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-700 hover:text-green-900 underline"
                  >
                    {contact.website}
                  </a>
                ) : 'Not provided'}
              </p>
              <p className="text-sm text-green-700">Company website</p>
            </div>
          </div>
        )}

        {/* Service Types for Service Providers */}
        {contact.type === 'service' && contact.service_types && contact.service_types.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Wrench size={18} className="text-gray-400" />
              <h4 className="text-sm font-medium text-gray-900">Services Offered</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {contact.service_types.map((service: string) => (
                <span 
                  key={service}
                  className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded-md border border-orange-200"
                >
                  {service}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
