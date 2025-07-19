-- SUPABASE DATABASE TRIGGER: Automatic New User Setup
-- This runs automatically when a user is created in auth.users
-- No webhooks or manual setup needed!

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_location_id uuid;
  user_email text;
BEGIN
  -- Get user email from the new record
  user_email := NEW.email;
  
  -- Create a new location for this user
  INSERT INTO public.locations (
    name,
    display_name,
    address,
    phone,
    email,
    owner_id
  ) VALUES (
    'user-location-' || NEW.id::text,
    COALESCE(user_email, 'User') || '''s Fleet',
    '123 Main Street, City, State 12345',
    '+1 (555) 123-4567',
    COALESCE(user_email, 'contact@example.com'),
    NEW.id  -- Set the new user as the owner
  )
  RETURNING id INTO new_location_id;
  
  -- Update the user's app_metadata with location_id and role
  NEW.raw_app_meta_data := COALESCE(NEW.raw_app_meta_data, '{}'::jsonb) || 
    jsonb_build_object(
      'location_id', new_location_id,
      'role', 'ADMIN',
      'setup_completed', true,
      'setup_date', now()
    );
  
  -- Log the successful setup
  RAISE NOTICE 'New user setup completed: % -> location: %', user_email, new_location_id;
  
  RETURN NEW;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Log any errors but don't fail the signup
    RAISE WARNING 'Failed to setup new user %: %', user_email, SQLERRM;
    RETURN NEW;
END;
$$;

-- Create the trigger that runs BEFORE INSERT on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  BEFORE INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO postgres;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- Test the function (you can run this to test)
-- SELECT public.handle_new_user_signup();
