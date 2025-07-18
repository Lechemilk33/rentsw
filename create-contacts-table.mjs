import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://clofjqoroioqfuisetyu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsb2ZqcW9yb2lvcWZ1aXNldHl1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjU5NTkzMSwiZXhwIjoyMDY4MTcxOTMxfQ.yG_YrtZjEmVAUKLmmfQuERW2b8Nd0igZrrcjzIYROlI'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createContactsTable() {
  console.log('Creating contacts table...')
  
  try {
    // Create the table
    const { error } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS contacts (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255),
          phone VARCHAR(50),
          type VARCHAR(20) NOT NULL CHECK (type IN ('service_provider', 'client', 'vendor', 'emergency')),
          company VARCHAR(255),
          address TEXT,
          tags TEXT[] DEFAULT '{}',
          last_contact TIMESTAMPTZ,
          service_types TEXT[] DEFAULT '{}',
          hourly_rate DECIMAL(10,2),
          rating DECIMAL(3,2),
          rental_history_count INTEGER DEFAULT 0,
          total_spent DECIMAL(15,2) DEFAULT 0,
          preferred_vehicle_type VARCHAR(100),
          membership_tier VARCHAR(20),
          last_rental_date DATE,
          notes TEXT,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
    })

    if (error) {
      console.error('Error creating table:', error)
      return
    }

    console.log('✅ Contacts table created successfully')

    // Insert sample data
    const sampleContacts = [
      {
        name: 'AutoCare Services',
        email: 'service@autocare.com',
        phone: '(555) 123-4567',
        type: 'service_provider',
        company: 'AutoCare Services LLC',
        address: '123 Mechanic St, Servicetown, ST 12345',
        service_types: ['Oil Change', 'Brake Repair', 'Engine Diagnostics'],
        hourly_rate: 85.00,
        rating: 4.8,
        tags: ['Trusted', 'Fast Service', '24/7']
      },
      {
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '(555) 234-5678',
        type: 'client',
        company: 'Smith Consulting',
        rental_history_count: 12,
        total_spent: 2850.00,
        preferred_vehicle_type: 'SUV',
        membership_tier: 'gold',
        tags: ['VIP', 'Regular']
      }
    ]

    const { error: insertError } = await supabase
      .from('contacts')
      .insert(sampleContacts)

    if (insertError) {
      console.error('Error inserting sample data:', insertError)
    } else {
      console.log('✅ Sample contacts inserted successfully')
    }

  } catch (error) {
    console.error('Error:', error)
  }
}

createContactsTable()
