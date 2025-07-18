import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://clofjqoroioqfuisetyu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsb2ZqcW9yb2lvcWZ1aXNldHl1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjU5NTkzMSwiZXhwIjoyMDY4MTcxOTMxfQ.yG_YrtZjEmVAUKLmmfQuERW2b8Nd0igZrrcjzIYROlI'
)

async function updateTestUser() {
  try {
    console.log('Updating test user with valid UUID location_id...')
    
    // Generate a proper UUID for location_id (we'll create the actual location later)
    const testLocationId = 'a0000000-0000-4000-8000-000000000001' // Valid test UUID
    
    // Update the test user with the correct location_id format
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      '4f50bbcb-d160-4452-9452-f6f9ee4a569d', // The user ID from previous creation
      {
        app_metadata: {
          location_id: testLocationId,
          role: 'ADMIN'
        }
      }
    )

    if (updateError) {
      console.error('Error updating user:', updateError.message)
      return
    }

    console.log('✅ Test user updated successfully!')
    console.log('\n🎉 Test account ready for login!')
    console.log('Email: test@example.com')
    console.log('Password: testpassword123')
    console.log('Location ID:', testLocationId)
    console.log('Role: ADMIN')
    console.log('\nNote: Make sure to run database_operations_setup.sql in Supabase SQL Editor')
    console.log('to create the required tables, then create a location record with this ID.')

  } catch (err) {
    console.error('Unexpected error:', err.message)
  }
}

updateTestUser()
