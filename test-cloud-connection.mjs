import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

console.log('Supabase URL:', supabaseUrl)
console.log('Anon Key present:', supabaseAnonKey ? 'Yes' : 'No')

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test connection
try {
  console.log('Testing Supabase connection...')
  const { data, error } = await supabase.from('locations').select('count').limit(1)
  
  if (error) {
    console.log('Error (expected if table doesn\'t exist):', error.message)
  } else {
    console.log('Connection successful! Result:', data)
  }
  
  // Test if we can query any table
  const { error: tablesError } = await supabase.rpc('version')
  if (tablesError) {
    console.log('RPC error:', tablesError.message)
  } else {
    console.log('Database version query successful')
  }
  
} catch (err) {
  console.error('Connection test failed:', err)
}
