-- MODERN SUPABASE MULTI-TENANT DATABASE SETUP
-- Following the official guide patterns

-- ================================================
-- 1. RLS HELPER FUNCTION FOR TENANT ISOLATION
-- ================================================

-- Helper function to extract location_id from JWT app_metadata
-- CRITICAL: Uses app_metadata (secure) not user_metadata (user-editable)
CREATE OR REPLACE FUNCTION public.get_user_location_id()
RETURNS text
LANGUAGE sql STABLE
AS $$
  SELECT nullif(
    ((current_setting('request.jwt.claims')::jsonb -> 'app_metadata')::jsonb ->> 'location_id'),
    ''
  )::text
$$;

-- ================================================
-- 2. CORE TENANT TABLES
-- ================================================

-- Locations table (our "tenants")
CREATE TABLE IF NOT EXISTS public.locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Companies table (associated with locations)
CREATE TABLE IF NOT EXISTS public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID REFERENCES public.locations(id) NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- 3. FLEET MANAGEMENT TABLES
-- ================================================

-- Vehicles table with location isolation
CREATE TABLE IF NOT EXISTS public.vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID REFERENCES public.locations(id) NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  license_plate TEXT,
  vin TEXT,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'rented', 'maintenance', 'out_of_service')),
  daily_rate DECIMAL(10,2),
  mileage INTEGER DEFAULT 0,
  fuel_type TEXT,
  transmission TEXT,
  color TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks/Maintenance table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID REFERENCES public.locations(id) NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id),
  assigned_to UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings/Rentals table
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id UUID REFERENCES public.locations(id) NOT NULL,
  vehicle_id UUID REFERENCES public.vehicles(id) NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  customer_phone TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'active', 'completed', 'cancelled')),
  total_amount DECIMAL(10,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- 4. ENABLE ROW LEVEL SECURITY
-- ================================================

ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- ================================================
-- 5. CREATE RLS POLICIES FOR TENANT ISOLATION
-- ================================================

-- Locations policies (users can only see their assigned location)
CREATE POLICY "location_isolation" ON public.locations
  FOR ALL TO authenticated
  USING (id::text = public.get_user_location_id());

-- Companies policies
CREATE POLICY "company_location_isolation" ON public.companies
  FOR ALL TO authenticated
  USING (location_id::text = public.get_user_location_id());

-- Vehicles policies
CREATE POLICY "vehicle_location_isolation" ON public.vehicles
  FOR ALL TO authenticated
  USING (location_id::text = public.get_user_location_id());

-- Tasks policies
CREATE POLICY "task_location_isolation" ON public.tasks
  FOR ALL TO authenticated
  USING (location_id::text = public.get_user_location_id());

-- Bookings policies
CREATE POLICY "booking_location_isolation" ON public.bookings
  FOR ALL TO authenticated
  USING (location_id::text = public.get_user_location_id());

-- ================================================
-- 6. PERFORMANCE INDEXES
-- ================================================

-- Critical: Index all location_id columns for performance
CREATE INDEX IF NOT EXISTS idx_companies_location_id ON public.companies(location_id);
CREATE INDEX IF NOT EXISTS idx_vehicles_location_id ON public.vehicles(location_id);
CREATE INDEX IF NOT EXISTS idx_tasks_location_id ON public.tasks(location_id);
CREATE INDEX IF NOT EXISTS idx_bookings_location_id ON public.bookings(location_id);

-- Additional performance indexes
CREATE INDEX IF NOT EXISTS idx_vehicles_status ON public.vehicles(status);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_vehicles_updated_at ON public.vehicles(updated_at);

-- ================================================
-- 7. TRIGGERS FOR UPDATED_AT
-- ================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON public.locations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON public.vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- 8. SAMPLE DATA FOR TESTING
-- ================================================

-- Insert sample locations
INSERT INTO public.locations (id, name, display_name, address, phone, email) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'miami-beach', 'Miami Beach', '123 Ocean Drive, Miami Beach, FL', '+1-305-555-0001', 'info@miami.rentxotic.com'),
  ('550e8400-e29b-41d4-a716-446655440002', 'los-angeles', 'Los Angeles', '456 Sunset Blvd, Los Angeles, CA', '+1-310-555-0002', 'info@la.rentxotic.com')
ON CONFLICT (id) DO NOTHING;

-- Insert sample companies
INSERT INTO public.companies (location_id, name) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'RentXotic Miami Beach'),
  ('550e8400-e29b-41d4-a716-446655440002', 'RentXotic Los Angeles')
ON CONFLICT DO NOTHING;

-- Insert sample vehicles
INSERT INTO public.vehicles (location_id, make, model, year, license_plate, status, daily_rate) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Ferrari', '488 GTB', 2023, 'FRRMI001', 'available', 1200.00),
  ('550e8400-e29b-41d4-a716-446655440001', 'Lamborghini', 'Huracán', 2023, 'LMBMI001', 'rented', 1500.00),
  ('550e8400-e29b-41d4-a716-446655440001', 'McLaren', '720S', 2022, 'MCLMI001', 'maintenance', 1800.00),
  ('550e8400-e29b-41d4-a716-446655440002', 'Porsche', '911 Turbo S', 2023, 'PORLA001', 'available', 800.00),
  ('550e8400-e29b-41d4-a716-446655440002', 'Aston Martin', 'DB11', 2023, 'ASTLA001', 'available', 1000.00)
ON CONFLICT DO NOTHING;

-- ================================================
-- SETUP COMPLETE!
-- ================================================

-- Next steps:
-- 1. Run this SQL in your Supabase SQL Editor
-- 2. Set user app_metadata.location_id for test users
-- 3. Test queries with explicit location_id filters
-- 4. Verify RLS policies are working properly