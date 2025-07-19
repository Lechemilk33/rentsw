import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setLoading(false)
    return { error }
  }

  const signUp = async (email: string, password: string) => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    setLoading(false)
    return { error }
  }

  const signOut = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    setLoading(false)
    return { error }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Convenience hook for getting user data
export function useUser() {
  const { user } = useAuth()
  return user
}

// Helper to check if user has specific role
export function useRole() {
  const { user } = useAuth()
  return user?.user_metadata?.role || 'USER'
}

// Helper to get user's location_id from either app_metadata or user_metadata
export function useLocationId() {
  const { user } = useAuth()
  
  // Check app_metadata first (admin-set), then user_metadata (user-set)
  return user?.app_metadata?.location_id || user?.user_metadata?.location_id || null
}

// Helper to set up a new user with their own location
export async function setupNewUser(user: User) {
  try {
    console.log('🔧 Setting up new user:', user.email)
    
    // Create a new location for this user (they become the owner)
    const { data: location, error: locationError } = await supabase
      .from('locations')
      .insert([{
        name: `user-location-${user.id}`,
        display_name: `${user.email}'s Fleet`,
        address: '123 Main Street, City, State 12345',
        phone: '+1 (555) 123-4567',
        email: user.email,
        owner_id: user.id  // Set the user as the owner of this location
      }])
      .select()
      .single()
    
    if (locationError) {
      console.error('❌ Error creating location:', locationError)
      throw locationError
    }
    
    console.log('✅ Created location:', location.id)
    
    // Update user metadata with location_id and role
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        location_id: location.id,
        role: 'ADMIN',
        setup_completed: true,
        setup_date: new Date().toISOString()
      }
    })
    
    if (updateError) {
      console.error('❌ Error updating user metadata:', updateError)
      throw updateError
    }
    
    console.log('✅ User setup completed successfully!')
    return location.id
    
  } catch (error) {
    console.error('❌ Failed to setup new user:', error)
    throw error
  }
}

// Helper to check if user can access certain features
export function usePermissions() {
  const role = useRole()
  
  return {
    canManageUsers: role === 'OWNER' || role === 'ADMIN',
    canManageVehicles: role === 'OWNER' || role === 'ADMIN',
    canViewReports: role === 'OWNER' || role === 'ADMIN',
    canSwitchLocations: role === 'OWNER',
    isOwner: role === 'OWNER',
    isAdmin: role === 'ADMIN',
    isUser: role === 'USER'
  }
}
