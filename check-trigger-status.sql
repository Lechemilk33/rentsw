-- Check if the user signup trigger exists and will work
SELECT 
  trigger_name,
  event_manipulation,
  action_statement,
  action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- Check if the trigger function exists
SELECT 
  proname,
  prosrc
FROM pg_proc 
WHERE proname = 'handle_new_user';

-- Test the current auth.uid() function
SELECT auth.uid() as current_user_id;

-- Check what happens when we try to get auth functions
SELECT 
  proname 
FROM pg_proc 
WHERE pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'auth')
  AND proname LIKE '%uid%';
