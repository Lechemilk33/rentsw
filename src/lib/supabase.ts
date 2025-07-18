import { createClient } from '@supabase/supabase-js'
import type { Database } from '../../types/supabase'

// Clean and validate environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim().replace(/\/+$/, '')
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

// Debug logging for development
if (typeof window !== 'undefined') {
  console.log('🔍 Supabase Environment Check:')
  console.log('URL:', supabaseUrl || 'NOT SET')
  console.log('Key:', supabaseAnonKey ? 'SET (length: ' + supabaseAnonKey.length + ')' : 'NOT SET')
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('VITE_SUPABASE_URL:', supabaseUrl)
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'SET' : 'NOT SET')
  throw new Error('Missing Supabase environment variables')
}

// Validate URL format
try {
  new URL(supabaseUrl)
  console.log('✅ Supabase URL is valid:', supabaseUrl)
} catch (error) {
  console.error('Invalid Supabase URL:', supabaseUrl, error)
  throw new Error(`Invalid Supabase URL: ${supabaseUrl}`)
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false // Set to false for SSR
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-application-name': 'RENTAGAIN'
    }
  }
})