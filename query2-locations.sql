-- QUERY 2: Check if any locations exist
SELECT 
  id,
  name,
  display_name,
  email,
  created_at
FROM public.locations
ORDER BY created_at DESC;
