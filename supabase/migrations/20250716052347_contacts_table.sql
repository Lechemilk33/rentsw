-- Contacts Table Schema
-- Professional contact management for fleet operations

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
    location_id UUID NOT NULL,
    
    -- Service provider specific fields
    service_types TEXT[] DEFAULT '{}',
    hourly_rate DECIMAL(10,2),
    rating DECIMAL(3,2) CHECK (rating >= 0 AND rating <= 5),
    
    -- Client specific fields
    rental_history_count INTEGER DEFAULT 0,
    total_spent DECIMAL(15,2) DEFAULT 0,
    preferred_vehicle_type VARCHAR(100),
    membership_tier VARCHAR(20) CHECK (membership_tier IN ('bronze', 'silver', 'gold', 'platinum')),
    last_rental_date DATE,
    
    -- Common fields
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_contacts_location_id ON contacts(location_id);
CREATE INDEX IF NOT EXISTS idx_contacts_type ON contacts(type);
CREATE INDEX IF NOT EXISTS idx_contacts_name ON contacts(name);
CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
CREATE INDEX IF NOT EXISTS idx_contacts_company ON contacts(company);
CREATE INDEX IF NOT EXISTS idx_contacts_tags ON contacts USING GIN(tags);

-- Enable RLS (Row Level Security)
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for multi-tenant access using the proper helper function
CREATE POLICY "Users can view contacts for their location" ON contacts
    FOR SELECT USING (location_id::text = public.get_user_location_id());

CREATE POLICY "Users can insert contacts for their location" ON contacts
    FOR INSERT WITH CHECK (location_id::text = public.get_user_location_id());

CREATE POLICY "Users can update contacts for their location" ON contacts
    FOR UPDATE USING (location_id::text = public.get_user_location_id());

CREATE POLICY "Users can delete contacts for their location" ON contacts
    FOR DELETE USING (location_id::text = public.get_user_location_id());

-- Create trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_contacts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_contacts_updated_at_trigger
    BEFORE UPDATE ON contacts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_contacts_updated_at();

-- Insert sample contacts for testing
INSERT INTO contacts (
    name, email, phone, type, company, address, service_types, 
    hourly_rate, rating, tags, location_id
) VALUES 
(
    'AutoCare Services',
    'service@autocare.com',
    '(555) 123-4567',
    'service_provider',
    'AutoCare Services LLC',
    '123 Mechanic St, Servicetown, ST 12345',
    ARRAY['Oil Change', 'Brake Repair', 'Engine Diagnostics', 'Tire Service'],
    85.00,
    4.8,
    ARRAY['Trusted', 'Fast Service', '24/7'],
    '550e8400-e29b-41d4-a716-446655440001'
),
(
    'Emergency Towing Co',
    'dispatch@emergtow.com',
    '(555) 999-0000',
    'service_provider',
    'Emergency Towing Co',
    '456 Tow St, Emergency City, ST 12346',
    ARRAY['24/7 Towing', 'Roadside Assistance', 'Jump Start'],
    120.00,
    4.6,
    ARRAY['Emergency', '24/7', 'Reliable'],
    '550e8400-e29b-41d4-a716-446655440001'
),
(
    'John Smith',
    'john.smith@email.com',
    '(555) 234-5678',
    'client',
    'Smith Consulting',
    '789 Client Ave, Customer City, ST 12347',
    '{}',
    NULL,
    NULL,
    ARRAY['VIP', 'Regular', 'Corporate'],
    '550e8400-e29b-41d4-a716-446655440001'
),
(
    'Premium Parts Supply',
    'orders@premiumparts.com',
    '(555) 456-7890',
    'vendor',
    'Premium Parts Supply Inc',
    '321 Parts Blvd, Supply Town, ST 12348',
    '{}',
    NULL,
    NULL,
    ARRAY['Parts', 'Wholesale', 'Fast Delivery'],
    '550e8400-e29b-41d4-a716-446655440001'
)
ON CONFLICT DO NOTHING;

-- Update client-specific fields for John Smith
UPDATE contacts 
SET 
    rental_history_count = 12,
    total_spent = 2850.00,
    preferred_vehicle_type = 'SUV',
    membership_tier = 'gold',
    last_rental_date = CURRENT_DATE - INTERVAL '15 days'
WHERE email = 'john.smith@email.com';

-- Comments for documentation
COMMENT ON TABLE contacts IS 'Professional contact management for fleet operations with multi-tenant isolation';
COMMENT ON COLUMN contacts.type IS 'Contact type: service_provider, client, vendor, or emergency';
COMMENT ON COLUMN contacts.service_types IS 'Array of services provided (for service providers)';
COMMENT ON COLUMN contacts.membership_tier IS 'Client membership level: bronze, silver, gold, platinum';
COMMENT ON COLUMN contacts.tags IS 'Searchable tags for quick filtering and categorization';