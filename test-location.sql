-- Create test location record with proper UUID
INSERT INTO locations (id, name, address, phone, email) 
VALUES (
    gen_random_uuid(),
    'Test Company',
    '123 Test Street, Test City, TC 12345',
    '+1-555-TEST',
    'admin@testcompany.com'
) 
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    address = EXCLUDED.address,
    phone = EXCLUDED.phone,
    email = EXCLUDED.email;
