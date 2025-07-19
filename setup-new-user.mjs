import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // You'll need this

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:')
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? 'SET' : 'MISSING')
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'SET' : 'MISSING')
  console.log('\nYou need to add SUPABASE_SERVICE_ROLE_KEY to your .env file')
  console.log('Get it from: Supabase Dashboard > Settings > API > service_role key')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function setupNewUser() {
  try {
    console.log('🔍 Looking for users without location_id...')
    
    // Get all users
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()
    
    if (error) {
      console.error('❌ Error fetching users:', error.message)
      return
    }
    
    console.log(`📋 Found ${users.length} total users`)
    
    // Find users without location_id
    const usersWithoutLocation = users.filter(user => 
      !user.app_metadata?.location_id
    )
    
    if (usersWithoutLocation.length === 0) {
      console.log('✅ All users already have location_id set up!')
      return
    }
    
    console.log(`\n🎯 Found ${usersWithoutLocation.length} users needing setup:`)
    usersWithoutLocation.forEach(user => {
      console.log(`  - ${user.email} (created: ${new Date(user.created_at).toLocaleDateString()})`)
    })
    
    // Get or create a test location
    const { data: locations, error: locationError } = await supabaseAdmin
      .from('locations')
      .select('id, display_name')
      .limit(1)
    
    if (locationError) {
      console.error('❌ Error fetching locations:', locationError.message)
      return
    }
    
    let locationId
    if (locations && locations.length > 0) {
      locationId = locations[0].id
      console.log(`\n📍 Using existing location: ${locations[0].display_name} (${locationId})`)
    } else {
      // Create a default location
      const { data: newLocation, error: createError } = await supabaseAdmin
        .from('locations')
        .insert([{
          name: 'default-location',
          display_name: 'Default Location',
          address: '123 Main St, City, State',
          phone: '+1 (555) 123-4567',
          email: 'contact@example.com'
        }])
        .select()
        .single()
      
      if (createError) {
        console.error('❌ Error creating location:', createError.message)
        return
      }
      
      locationId = newLocation.id
      console.log(`\n📍 Created new location: ${newLocation.display_name} (${locationId})`)
    }
    
    // Set up each user
    for (const user of usersWithoutLocation) {
      console.log(`\n🔧 Setting up user: ${user.email}`)
      
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        user.id,
        {
          app_metadata: {
            location_id: locationId,
            role: 'ADMIN' // Give them admin access
          }
        }
      )
      
      if (updateError) {
        console.error(`❌ Error updating ${user.email}:`, updateError.message)
      } else {
        console.log(`✅ ${user.email} → location_id: ${locationId}, role: ADMIN`)
      }
    }
    
    console.log('\n🎉 User setup complete!')
    console.log('\n📝 Next steps:')
    console.log('1. Sign out and sign back in to refresh your session')
    console.log('2. You should now see an empty fleet instead of mock data')
    console.log('3. Add some real vehicles through the fleet management interface')
    
  } catch (err) {
    console.error('❌ Unexpected error:', err.message)
  }
}

setupNewUser()
