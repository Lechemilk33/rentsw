-- USER SETUP SCRIPT FOR TESTING
-- Run this in Supabase SQL Editor after creating a test user

-- ================================================
-- STEP 1: CREATE A TEST USER
-- ================================================
-- Go to Supabase Dashboard > Authentication > Users
-- Click "Add User" and create:
-- Email: test@rentxotic.com
-- Password: TestPassword123!
-- Auto-confirm: Yes

-- ================================================
-- STEP 2: SET APP_METADATA FOR TENANT ISOLATION
-- ================================================

-- IMPORTANT: auth.update_user() DOES exist but requires SERVICE ROLE permissions!
-- This can only be executed with a service role key, not regular user tokens
-- Run this in Supabase SQL Editor (which uses service role automatically)

-- Set metadata for test user (Miami Beach Owner)
SELECT auth.update_user(
  (SELECT id FROM auth.users WHERE email = 'test@rentxotic.com'),
  jsonb_build_object(
    'app_metadata', jsonb_build_object(
      'location_id', '550e8400-e29b-41d4-a716-446655440001',
      'role', 'OWNER'
    )
  )
);

-- Set metadata for admin user (Miami Beach Admin)
SELECT auth.update_user(
  (SELECT id FROM auth.users WHERE email = 'admin-miami@rentxotic.com'),
  jsonb_build_object(
    'app_metadata', jsonb_build_object(
      'location_id', '550e8400-e29b-41d4-a716-446655440001',
      'role', 'ADMIN'
    )
  )
);

-- Set metadata for regular user (Los Angeles User)
SELECT auth.update_user(
  (SELECT id FROM auth.users WHERE email = 'user-la@rentxotic.com'),
  jsonb_build_object(
    'app_metadata', jsonb_build_object(
      'location_id', '550e8400-e29b-41d4-a716-446655440002',
      'role', 'USER'
    )
  )
);

-- ================================================
-- METHOD 1: SUPABASE SQL EDITOR (SERVICE ROLE)
-- ================================================

-- The auth.update_user() function DOES exist and works when:
-- ✅ Executed in Supabase SQL Editor (automatic service role)
-- ✅ Used with service role key in server-side code
-- ✅ Called via Admin API endpoints

-- If the above SQL fails, ensure you're running it in:
-- 1. Supabase Dashboard > SQL Editor (recommended)
-- 2. Server-side code with service role key
-- 3. NOT from client-side application code

-- ================================================
-- METHOD 2: SUPABASE DASHBOARD (MANUAL FALLBACK)
-- ================================================

-- If SQL method doesn't work, use Dashboard:
-- 1. Go to Authentication > Users
-- 2. Click user > Edit User
-- 3. Set app_metadata in User Metadata section:

-- ================================================
-- STEP 3: VERIFY SETUP
-- ================================================

-- Check user metadata (run this after setting metadata via Dashboard)
SELECT id, email, app_metadata, user_metadata 
FROM auth.users 
WHERE email = 'test@rentxotic.com';

-- Test RLS helper function (run while authenticated as test user)
SELECT auth.location_id() as extracted_location_id;

-- Test that vehicles are properly filtered
SELECT id, make, model, location_id 
FROM public.vehicles 
WHERE location_id::text = auth.location_id();

-- ================================================
-- METHOD 3: ADMIN SDK IN YOUR APPLICATION
-- ================================================

-- For server-side code with service role key:
/*
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Service role key required!
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// This works because we're using service role key
const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
  userId,
  {
    app_metadata: {
      location_id: '550e8400-e29b-41d4-a716-446655440001',
      role: 'OWNER'
    }
  }
)
*/

-- ================================================
-- WHY SERVICE ROLE IS REQUIRED
-- ================================================

-- app_metadata security model:
-- ✅ app_metadata = Admin/system controlled (secure)
-- ✅ user_metadata = User controlled (less secure)
-- 
-- Only service role can modify app_metadata because:
-- - Prevents users from escalating their own permissions
-- - Ensures tenant isolation cannot be bypassed
-- - Maintains security boundaries in multi-tenant systems

-- ================================================
-- METHOD 4: AUTH HOOK (AUTOMATIC ASSIGNMENT)
-- ================================================

-- You can create a Database Function that runs on user creation:
/*
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  -- Auto-assign default location and role
  UPDATE auth.users 
  SET raw_app_meta_data = jsonb_build_object(
    'location_id', '550e8400-e29b-41d4-a716-446655440001',
    'role', 'USER'
  )
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
*/

-- ================================================
-- VERIFICATION QUERIES
-- ================================================

-- Verify all test users have proper metadata
-- (Run this after setting metadata via Dashboard)
SELECT 
  email,
  app_metadata->>'location_id' as location_id,
  app_metadata->>'role' as role
FROM auth.users 
WHERE email LIKE '%@rentxotic.com';

-- Test that RLS is working properly
-- (Should only return vehicles for user's location)
SELECT 
  v.id,
  v.make,
  v.model,
  v.location_id,
  l.display_name as location_name
FROM public.vehicles v
JOIN public.locations l ON v.location_id = l.id;

-- ================================================
-- QUICK SETUP CHECKLIST
-- ================================================

-- ✅ Step 1: Run database_setup.sql in Supabase SQL Editor
-- ✅ Step 2: Create test users in Supabase Dashboard > Authentication > Users
--    - test@rentxotic.com (password: TestPassword123!)
--    - admin-miami@rentxotic.com 
--    - user-la@rentxotic.com
-- ✅ Step 3: Run the auth.update_user() SQL commands above in SQL Editor
--    (They work because SQL Editor uses service role automatically)
-- ✅ Step 4: Test login and verify tenant isolation works
-- ✅ Step 5: Run verification queries to confirm setup

-- ================================================
-- TROUBLESHOOTING
-- ================================================

-- If auth.update_user() fails:
-- ❌ Check you're in Supabase SQL Editor (not client-side code)
-- ❌ Ensure users exist before running metadata updates
-- ❌ Verify you have service role permissions
-- ✅ Fall back to Dashboard manual method
-- ✅ Or use Admin SDK in server-side code

-- ================================================
-- ALTERNATIVE: DASHBOARD METHOD (RECOMMENDED)
-- ================================================

-- This is the ONLY reliable way to set app_metadata:
-- 1. Go to Authentication > Users in Supabase Dashboard
-- 2. Click on a user row
-- 3. Click "Edit User" button
-- 4. Scroll to "User Metadata" section
-- 5. In the app_metadata field, paste the JSON for each user

-- For test@rentxotic.com (Miami Beach Owner):
-- {
--   "location_id": "550e8400-e29b-41d4-a716-446655440001",
--   "role": "OWNER"
-- }

-- For admin-miami@rentxotic.com (Miami Beach Admin):
-- {
--   "location_id": "550e8400-e29b-41d4-a716-446655440001", 
--   "role": "ADMIN"
-- }

-- For user-la@rentxotic.com (Los Angeles User):
-- {
--   "location_id": "550e8400-e29b-41d4-a716-446655440002",
--   "role": "USER"
-- }

-- ================================================
-- ALTERNATIVE: USING SUPABASE ADMIN SDK
-- ================================================

-- If you're using the admin SDK in your application:
-- const { data, error } = await supabase.auth.admin.updateUserById(
--   userId,
--   {
--     app_metadata: {
--       location_id: '550e8400-e29b-41d4-a716-446655440001',
--       role: 'OWNER'
--     }
--   }
-- )
