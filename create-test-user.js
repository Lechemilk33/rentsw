import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  'https://clofjqoroioqfuisetyu.supabase.co', // Correct URL from env file
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsb2ZqcW9yb2lvcWZ1aXNldHl1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjU5NTkzMSwiZXhwIjoyMDY4MTcxOTMxfQ.yG_YrtZjEmVAUKLmmfQuERW2b8Nd0igZrrcjzIYROlI' // Service role key
)

async function createTestUser() {
  try {
    console.log('Creating test user...')
    
    // Create the test user with admin privileges
    const { data, error } = await supabase.auth.admin.createUser({
      email: 'test@example.com',
      password: 'testpassword123',
      email_confirm: true, // Skip email confirmation for testing
      app_metadata: {
        location_id: 'loc_test_001', // Test location ID for multi-tenant access
        role: 'ADMIN' // Full admin access
      },
      user_metadata: {
        full_name: 'Test User',
        first_name: 'Test',
        last_name: 'User'
      }
    })

    if (error) {
      console.error('Error creating user:', error.message)
      return
    }

    console.log('✅ Test user created successfully!')
    console.log('Email: test@example.com')
    console.log('Password: testpassword123')
    console.log('Location ID:', data.user.app_metadata.location_id)
    console.log('Role:', data.user.app_metadata.role)
    console.log('User ID:', data.user.id)

    // Also create a test location record if it doesn't exist
    const { error: locationError } = await supabase
      .from('locations')
      .upsert({
        id: 'loc_test_001',
        name: 'Test Company',
        address: '123 Test Street, Test City, TC 12345',
        phone: '+1-555-TEST',
        email: 'admin@testcompany.com'
      })

    if (locationError) {
      console.warn('Note: Could not create location record:', locationError.message)
      console.log('You may need to run the database setup first.')
    } else {
      console.log('✅ Test location record created/updated')
    }

  } catch (err) {
    console.error('Unexpected error:', err.message)
  }
}

createTestUser()
