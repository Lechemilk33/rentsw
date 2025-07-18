// Quick test to verify environment variables are loading
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('Supabase Anon Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Present' : 'Missing')

import { supabase } from './src/lib/supabase'

// Test basic connection
supabase.from('profiles').select('count').limit(1)
  .then(result => console.log('Supabase connection test:', result))
  .catch(error => console.error('Supabase connection error:', error))
