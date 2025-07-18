#!/usr/bin/env node

/**
 * Add Test Booking Data for Calendar Testing
 * 
 * This script adds sample booking data to test the calendar integration
 */

import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.log('Required: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or VITE_SUPABASE_ANON_KEY)')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function addTestBooking() {
  try {
    console.log('🔍 Checking existing data...')
    
    // Check if we have vehicles
    const { data: vehicles, error: vehicleError } = await supabase
      .from('vehicles')
      .select('id, make, model, license_plate')
      .limit(5)
    
    if (vehicleError) {
      console.error('❌ Error fetching vehicles:', vehicleError.message)
      return
    }
    
    if (!vehicles || vehicles.length === 0) {
      console.log('⚠️  No vehicles found. Creating a test vehicle first...')
      
      const { data: newVehicle, error: createError } = await supabase
        .from('vehicles')
        .insert([{
          make: 'Toyota',
          model: 'Camry',
          year: 2023,
          license_plate: 'TEST123',
          vin: 'TEST123456789',
          location_id: 'test-location-uuid',
          status: 'available',
          daily_rate: 50.00
        }])
        .select()
        .single()
      
      if (createError) {
        console.error('❌ Error creating test vehicle:', createError.message)
        return
      }
      
      vehicles.push(newVehicle)
      console.log('✅ Created test vehicle:', newVehicle.license_plate)
    }
    
    const testVehicle = vehicles[0]
    console.log('🚗 Using vehicle:', testVehicle.make, testVehicle.model, testVehicle.license_plate)
    
    // Create test bookings
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    
    const testBookings = [
      {
        customer_name: 'John Doe',
        customer_email: 'john.doe@example.com',
        customer_phone: '(555) 123-4567',
        vehicle_id: testVehicle.id,
        location_id: 'test-location-uuid',
        start_date: `${today.toISOString().split('T')[0]}T09:00:00Z`,
        end_date: `${today.toISOString().split('T')[0]}T17:00:00Z`,
        status: 'active',
        total_amount: 50.00
      },
      {
        customer_name: 'Jane Smith',
        customer_email: 'jane.smith@example.com',
        customer_phone: '(555) 987-6543',
        vehicle_id: testVehicle.id,
        location_id: 'test-location-uuid',
        start_date: `${tomorrow.toISOString().split('T')[0]}T10:30:00Z`,
        end_date: `${tomorrow.toISOString().split('T')[0]}T15:30:00Z`,
        status: 'pending',
        total_amount: 75.00
      }
    ]
    
    console.log('📅 Adding test bookings...')
    
    for (const booking of testBookings) {
      const { data, error } = await supabase
        .from('bookings')
        .insert([booking])
        .select()
        .single()
      
      if (error) {
        console.error('❌ Error creating booking:', error.message)
      } else {
        console.log('✅ Created booking:', data.customer_name, 'on', booking.start_date.split('T')[0])
      }
    }
    
    console.log('🎉 Test booking data added successfully!')
    console.log('💡 You can now test the calendar to see real booking data')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message)
  }
}

// Run the script
addTestBooking()
