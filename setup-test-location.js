import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://clofjqoroioqfuisetyu.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsb2ZqcW9yb2lvcWZ1aXNldHl1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjU5NTkzMSwiZXhwIjoyMDY4MTcxOTMxfQ.yG_YrtZjEmVAUKLmmfQuERW2b8Nd0igZrrcjzIYROlI'
)

async function createTestLocation() {
  try {
    console.log('Creating test location...')
    
    // First create a test location with proper UUID
    const { data: locationData, error: locationError } = await supabase
      .from('locations')
      .insert({
        company_name: 'Test Company',
        address: '123 Test Street, Test City, TC 12345',
        phone: '+1-555-TEST',
        email: 'admin@testcompany.com'
      })
      .select()
      .single()

    if (locationError) {
      console.error('Error creating location:', locationError.message)
      return
    }

    console.log('✅ Test location created:', locationData.id)

    // Now update the test user with the correct location_id
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      '4f50bbcb-d160-4452-9452-f6f9ee4a569d', // The user ID from previous creation
      {
        app_metadata: {
          location_id: locationData.id,
          role: 'ADMIN'
        }
      }
    )

    if (updateError) {
      console.error('Error updating user:', updateError.message)
      return
    }

    console.log('✅ Test user updated with location ID:', locationData.id)
    console.log('\n🎉 Test account ready!')
    console.log('Email: test@example.com')
    console.log('Password: testpassword123')
    console.log('Location ID:', locationData.id)
    console.log('Role: ADMIN')

  } catch (err) {
    console.error('Unexpected error:', err.message)
  }
}

createTestLocation()
