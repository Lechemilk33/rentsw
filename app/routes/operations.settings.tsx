import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { createClient } from '@supabase/supabase-js'
import type { Session } from '@supabase/supabase-js'
import { 
  Button, 
  Card, 
  Badge, 
  Input, 
  Loading 
} from '../../src/components/ui'
import { 
  User, 
  Bell, 
  Shield,
  Camera,
  Eye,
  EyeSlash,
  Check,
  X,
  ArrowLeft
} from 'phosphor-react'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

interface UserProfile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  phone?: string
  role: string
  location_id: string
  created_at: string
  last_sign_in: string
}

interface NotificationSettings {
  maintenance_alerts: boolean
  booking_notifications: boolean
  low_fuel_alerts: boolean
  payment_reminders: boolean
  system_updates: boolean
  marketing_emails: boolean
}

type SettingsTab = 'profile' | 'account' | 'notifications'

export default function SettingsPage() {
  const navigate = useNavigate()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile')
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [notifications, setNotifications] = useState<NotificationSettings>({
    maintenance_alerts: true,
    booking_notifications: true,
    low_fuel_alerts: true,
    payment_reminders: true,
    system_updates: true,
    marketing_emails: false
  })
  const [saveLoading, setSaveLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Get session and load user data
  useEffect(() => {
    const getSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        
        if (session?.user) {
          await loadUserProfile(session.user.id)
        }
      } catch (error) {
        console.error('Error loading session:', error)
      } finally {
        setLoading(false)
      }
    }

    getSession()
  }, [])

  const loadUserProfile = async (userId: string) => {
    try {
      // Mock user profile data for now
      setUserProfile({
        id: userId,
        email: session?.user?.email || 'user@example.com',
        full_name: session?.user?.user_metadata?.full_name || 'John Doe',
        avatar_url: session?.user?.user_metadata?.avatar_url,
        phone: '+1 (555) 123-4567',
        role: session?.user?.app_metadata?.role || 'admin',
        location_id: session?.user?.app_metadata?.location_id || 'loc-1',
        created_at: '2024-01-15T10:00:00Z',
        last_sign_in: session?.user?.last_sign_in_at || new Date().toISOString()
      })
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  const settingsTabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'account', label: 'Account', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ]

  const handleNotificationToggle = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSave = async () => {
    setSaveLoading(true)
    try {
      // Simulate save operation
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Here you would save to Supabase
      console.log('Settings saved successfully')
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setSaveLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loading size="lg" />
      </div>
    )
  }

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              {userProfile?.avatar_url ? (
                <img src={userProfile.avatar_url} alt="Profile" className="w-full h-full rounded-full object-cover" />
              ) : (
                <User weight="light" size={32} className="text-gray-500" />
              )}
            </div>
            <div>
              <Button variant="outline" size="sm" className="mb-2">
                <Camera weight="regular" size={16} className="mr-2" />
                Change Photo
              </Button>
              <p className="text-sm text-gray-500">JPG, PNG or GIF. Max size 2MB.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <Input 
                id="fullName"
                type="text" 
                defaultValue={userProfile?.full_name}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <Input 
                id="email"
                type="email" 
                defaultValue={userProfile?.email}
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <Input 
                id="phone"
                type="tel" 
                defaultValue={userProfile?.phone}
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <div id="role" className="flex items-center space-x-2">
                <Badge variant="primary">{userProfile?.role}</Badge>
                <span className="text-sm text-gray-500">Contact admin to change role</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select id="language" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
          </div>
          <div>
            <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select id="timezone" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
            </select>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Fleet Notifications</h3>
        <div className="space-y-4">
          {Object.entries(notifications).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <h4 className="font-medium capitalize">
                  {key.replace(/_/g, ' ')}
                </h4>
                <p className="text-sm text-gray-500">
                  {key === 'maintenance_alerts' && 'Get notified about vehicle maintenance schedules'}
                  {key === 'booking_notifications' && 'Receive updates about new bookings and changes'}
                  {key === 'low_fuel_alerts' && 'Alerts when vehicles need refueling'}
                  {key === 'payment_reminders' && 'Reminders for upcoming payments'}
                  {key === 'system_updates' && 'System maintenance and feature updates'}
                  {key === 'marketing_emails' && 'Promotional offers and company news'}
                </p>
              </div>
              <Button
                variant={value ? "success" : "outline"}
                size="sm"
                onClick={() => handleNotificationToggle(key as keyof NotificationSettings)}
              >
                {value ? <Check weight="bold" size={16} /> : <X weight="bold" size={16} />}
              </Button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Password & Authentication</h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
            <div className="relative">
              <Input 
                id="currentPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter current password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? 
                  <EyeSlash weight="regular" size={20} className="text-gray-500" /> : 
                  <Eye weight="regular" size={20} className="text-gray-500" />
                }
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
            <Input 
              id="newPassword"
              type="password"
              placeholder="Enter new password"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
            <Input 
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
            />
          </div>
          <Button variant="primary">Update Password</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication</h3>
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium">Enable 2FA</h4>
            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
          </div>
          <Button variant="outline">Setup 2FA</Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Active Sessions</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium">Current Session</h4>
              <p className="text-sm text-gray-500">Chrome on Windows • Miami, FL</p>
            </div>
            <Badge variant="success">Active</Badge>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Account Management</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div>
              <h4 className="font-medium text-red-900">Delete Account</h4>
              <p className="text-sm text-red-700">Permanently delete your account and all associated data</p>
            </div>
            <Button variant="danger">Delete Account</Button>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSettings()
      case 'account':
        return renderAccountSettings()
      case 'notifications':
        return renderNotificationSettings()
      default:
        return renderProfileSettings()
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header with Back Button */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/operations')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={20} weight="regular" />
            <span>Back to Operations</span>
          </button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account, preferences, and security settings</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <Card className="p-4">
            <nav className="space-y-2">
              {settingsTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as SettingsTab)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <tab.icon weight="regular" size={20} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </Card>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          {renderTabContent()}
          
          {/* Save Button */}
          <div className="mt-6 flex justify-end">
            <Button 
              variant="primary" 
              onClick={handleSave}
              loading={saveLoading}
              className="px-8"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
