/**
 * Modern Contact Overlay - Clean, modern design with smooth animations
 * Replaces the old complex overlay with a beautiful, simple interface
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
  Star
} from 'phosphor-react'
import { useContacts } from './ModernContactProvider'
import type { Contact } from './types'

export function ModernContactOverlay() {
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

  const [showNewContactForm, setShowNewContactForm] = useState(false)

  if (!isOpen) return null

  // Filter contacts based on search
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone?.includes(searchQuery) ||
    contact.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const getContactTypeColor = (type: string) => {
    switch (type) {
      case 'client': return 'bg-green-100 text-green-800 border-green-200'
      case 'service': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'employee': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getContactIcon = (type: string) => {
    switch (type) {
      case 'client': return '👤'
      case 'service': return '🔧'
      case 'employee': return '👔'
      default: return '📞'
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={closeContactBook}
      />
      
      {/* Main Container */}
      <div className="relative w-full max-w-4xl h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
              <User size={20} className="text-white" weight="duotone" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Contacts</h2>
              <p className="text-sm text-gray-600">{filteredContacts.length} contacts</p>
            </div>
          </div>
          <button
            onClick={closeContactBook}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        <div className="flex h-[532px]">
          {/* Contact List */}
          <div className="w-1/2 border-r border-gray-200 flex flex-col">
            {/* Search Bar */}
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <MagnifyingGlass size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Add Contact Button */}
            <div className="p-4 border-b border-gray-100">
              <button
                onClick={() => setShowNewContactForm(true)}
                className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                <Plus size={18} />
                <span>Add Contact</span>
              </button>
            </div>

            {/* Contact List */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredContacts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                  <User size={32} className="mb-2 opacity-50" />
                  <p>No contacts found</p>
                </div>
              ) : (
                <div className="space-y-1 p-2">
                  {filteredContacts.map((contact) => (
                    <button
                      key={contact.id}
                      onClick={() => selectContact(contact)}
                      className={`w-full text-left p-3 rounded-lg transition-all hover:bg-gray-50 ${
                        selectedContact?.id === contact.id ? 'bg-blue-50 border border-blue-200' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                          {getContactIcon(contact.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-medium text-gray-900 truncate">{contact.name}</h3>
                            <span className={`px-2 py-0.5 text-xs rounded-full border ${getContactTypeColor(contact.type)}`}>
                              {contact.type}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 truncate">{contact.email || contact.phone}</p>
                          {contact.company && (
                            <p className="text-xs text-gray-500 truncate">{contact.company}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Contact Detail Panel */}
          <div className="w-1/2 flex flex-col">
            {selectedContact ? (
              <ContactDetailPanel contact={selectedContact} />
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <User size={48} className="mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium mb-2">Select a contact</p>
                  <p className="text-sm">Choose a contact from the list to view details</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}

function ContactDetailPanel({ contact }: { contact: Contact }) {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Contact Header */}
      <div className="p-6 border-b border-gray-200 bg-gradient-to-br from-gray-50 to-white">
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-2xl text-white font-semibold">
            {contact.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{contact.name}</h3>
            <div className="flex items-center space-x-2 mb-2">
              <span className={`px-3 py-1 text-sm rounded-full border ${
                contact.type === 'client' ? 'bg-green-100 text-green-800 border-green-200' :
                contact.type === 'service' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                contact.type === 'employee' ? 'bg-purple-100 text-purple-800 border-purple-200' :
                'bg-gray-100 text-gray-800 border-gray-200'
              }`}>
                {contact.type.charAt(0).toUpperCase() + contact.type.slice(1)}
              </span>
              {contact.rating && (
                <div className="flex items-center space-x-1">
                  <Star size={14} weight="fill" className="text-yellow-400" />
                  <span className="text-sm text-gray-600">{contact.rating}</span>
                </div>
              )}
            </div>
            {contact.company && (
              <p className="text-gray-600">{contact.company}</p>
            )}
          </div>
        </div>
      </div>

      {/* Contact Details */}
      <div className="p-6 space-y-6">
        {/* Contact Information */}
        <div className="grid grid-cols-1 gap-4">
          {contact.email && (
            <div className="flex items-center space-x-3">
              <Envelope size={18} className="text-gray-400" />
              <a 
                href={`mailto:${contact.email}`}
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                {contact.email}
              </a>
            </div>
          )}
          {contact.phone && (
            <div className="flex items-center space-x-3">
              <Phone size={18} className="text-gray-400" />
              <a 
                href={`tel:${contact.phone}`}
                className="text-blue-600 hover:text-blue-700 transition-colors"
              >
                {contact.phone}
              </a>
            </div>
          )}
          {contact.address && (
            <div className="flex items-start space-x-3">
              <MapPin size={18} className="text-gray-400 mt-0.5" />
              <span className="text-gray-700">{contact.address}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {contact.tags.length > 0 && (
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Tag size={18} className="text-gray-400" />
              <h4 className="text-sm font-medium text-gray-900">Tags</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {contact.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Type-specific Information */}
        {contact.type === 'client' && (
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Client Information</h4>
            <div className="space-y-2 text-sm">
              {contact.rental_history_count && (
                <p><span className="text-gray-600">Rentals:</span> {contact.rental_history_count}</p>
              )}
              {contact.preferred_vehicle_type && (
                <p><span className="text-gray-600">Prefers:</span> {contact.preferred_vehicle_type}</p>
              )}
              {contact.last_rental_date && (
                <p><span className="text-gray-600">Last rental:</span> {new Date(contact.last_rental_date).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        )}

        {contact.type === 'service' && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Service Provider</h4>
            <div className="space-y-2 text-sm">
              {contact.service_types && contact.service_types.length > 0 && (
                <p><span className="text-gray-600">Services:</span> {contact.service_types.join(', ')}</p>
              )}
              {contact.hourly_rate && (
                <p><span className="text-gray-600">Rate:</span> ${contact.hourly_rate}/hour</p>
              )}
            </div>
          </div>
        )}

        {contact.type === 'employee' && (
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Employee Details</h4>
            <div className="space-y-2 text-sm">
              {contact.department && (
                <p><span className="text-gray-600">Department:</span> {contact.department}</p>
              )}
              {contact.position && (
                <p><span className="text-gray-600">Position:</span> {contact.position}</p>
              )}
              {contact.hire_date && (
                <p><span className="text-gray-600">Hired:</span> {new Date(contact.hire_date).toLocaleDateString()}</p>
              )}
            </div>
          </div>
        )}

        {/* Notes */}
        {contact.notes && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
            <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{contact.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
