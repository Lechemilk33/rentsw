import { supabase } from './src/lib/supabase.js'

async function testConnection() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test basic connection
    const { data, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('❌ Supabase connection error:', error.message)
    } else {
      console.log('✅ Supabase connection successful!')
      console.log('Current session:', data.session ? 'Logged in' : 'Not logged in')
    }
    
    // Test a simple query to verify API key works
    const { data: testData, error: queryError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1)
    
    if (queryError) {
      console.log('⚠️  Database query test:', queryError.message)
    } else {
      console.log('✅ Database query test successful')
    }
    
  } catch (err) {
    console.error('❌ Unexpected error:', err)
  }
}

testConnection()
