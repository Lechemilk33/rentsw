-- FIX: Allow users to create and manage their own locations
-- This is needed for new user signup to work properly
-- The person who creates a location becomes the owner

-- First, let's see what RLS policies exist
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'locations';

-- Allow authenticated users to create locations (they become the owner)
CREATE POLICY "authenticated_users_can_create_locations" ON public.locations
  FOR INSERT TO authenticated
  WITH CHECK (owner_id = auth.uid());

-- Allow users to view all locations (needed for admin features)
CREATE POLICY "authenticated_users_can_view_locations" ON public.locations
  FOR SELECT TO authenticated
  USING (true);

-- Allow users to update locations they own
CREATE POLICY "owners_can_update_their_locations" ON public.locations
  FOR UPDATE TO authenticated
  USING (owner_id = auth.uid())
  WITH CHECK (owner_id = auth.uid());

-- Allow owners to delete their locations
CREATE POLICY "owners_can_delete_their_locations" ON public.locations
  FOR DELETE TO authenticated
  USING (owner_id = auth.uid());

-- Test will be done from the app, not SQL Editor
-- When a real user signs up through the app, auth.uid() will work properly
-- because they'll be authenticated

-- The policies above will work when:
-- 1. User signs up through your app
-- 2. App creates location with owner_id = user's ID
-- 3. RLS policies allow it because auth.uid() matches owner_id
