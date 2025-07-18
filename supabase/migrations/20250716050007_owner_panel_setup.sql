-- Owner Panel Database Schema Extensions
-- This file extends the existing database setup with owner-specific tables and policies

-- Corporate hierarchy management
CREATE TABLE IF NOT EXISTS corporate_hierarchy (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) NOT NULL,
  organization_name text NOT NULL,
  corporate_settings jsonb DEFAULT '{}',
  billing_config jsonb DEFAULT '{}',
  security_policies jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enhanced locations table for owner management
ALTER TABLE locations 
ADD COLUMN IF NOT EXISTS owner_id uuid REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS corporate_hierarchy_id uuid REFERENCES corporate_hierarchy(id),
ADD COLUMN IF NOT EXISTS location_status text DEFAULT 'active' CHECK (location_status IN ('active', 'inactive', 'setup', 'suspended')),
ADD COLUMN IF NOT EXISTS business_config jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS financial_config jsonb DEFAULT '{}',
ADD COLUMN IF NOT EXISTS compliance_status jsonb DEFAULT '{}';

-- Corporate financial aggregation and reporting
CREATE TABLE IF NOT EXISTS corporate_financials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  corporate_hierarchy_id uuid REFERENCES corporate_hierarchy(id) NOT NULL,
  location_id uuid REFERENCES locations(id),
  period_start date NOT NULL,
  period_end date NOT NULL,
  total_revenue decimal(15,2) DEFAULT 0,
  total_expenses decimal(15,2) DEFAULT 0,
  net_profit decimal(15,2) DEFAULT 0,
  vehicle_count integer DEFAULT 0,
  utilization_rate decimal(5,2) DEFAULT 0,
  customer_count integer DEFAULT 0,
  booking_count integer DEFAULT 0,
  metrics jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Owner-level audit logging for sensitive operations
CREATE TABLE IF NOT EXISTS owner_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) NOT NULL,
  action text NOT NULL,
  target_location_id uuid REFERENCES locations(id),
  target_user_id uuid REFERENCES auth.users(id),
  action_details jsonb,
  sensitive_data_accessed boolean DEFAULT false,
  ip_address inet,
  user_agent text,
  session_id text,
  risk_level text DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
  created_at timestamptz DEFAULT now()
);

-- Location performance metrics for analytics
CREATE TABLE IF NOT EXISTS location_performance_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  location_id uuid REFERENCES locations(id) NOT NULL,
  metric_date date NOT NULL,
  fleet_utilization decimal(5,2),
  revenue_amount decimal(15,2),
  booking_count integer,
  customer_satisfaction decimal(3,2),
  maintenance_costs decimal(10,2),
  operational_costs decimal(10,2),
  staff_count integer,
  incidents_count integer,
  metrics_data jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(location_id, metric_date)
);

-- Corporate team management
CREATE TABLE IF NOT EXISTS corporate_team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  corporate_hierarchy_id uuid REFERENCES corporate_hierarchy(id) NOT NULL,
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  role text NOT NULL CHECK (role IN ('OWNER', 'SUPER_ADMIN', 'CORPORATE_MANAGER')),
  permissions jsonb DEFAULT '{}',
  access_level text DEFAULT 'standard' CHECK (access_level IN ('standard', 'elevated', 'emergency')),
  assigned_locations uuid[] DEFAULT '{}',
  status text DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(corporate_hierarchy_id, user_id)
);

-- Location creation workflow tracking
CREATE TABLE IF NOT EXISTS location_creation_workflows (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid REFERENCES auth.users(id) NOT NULL,
  location_id uuid REFERENCES locations(id),
  workflow_status text DEFAULT 'in_progress' CHECK (workflow_status IN ('in_progress', 'completed', 'failed', 'cancelled')),
  current_step integer DEFAULT 1,
  total_steps integer DEFAULT 6,
  step_data jsonb DEFAULT '{}',
  admin_email text,
  admin_name text,
  setup_config jsonb DEFAULT '{}',
  validation_errors jsonb DEFAULT '{}',
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enhanced RLS policies for owner access

-- Full access policy for owners
CREATE POLICY "owners_full_access_locations" ON locations
  FOR ALL TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'OWNER' OR 
    location_id = (auth.jwt() ->> 'location_id')::uuid
  );

-- Corporate hierarchy access
CREATE POLICY "owner_corporate_hierarchy_access" ON corporate_hierarchy
  FOR ALL TO authenticated
  USING (owner_id = auth.uid() AND auth.jwt() ->> 'role' = 'OWNER');

-- Corporate financials access
CREATE POLICY "owner_financials_access" ON corporate_financials
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM corporate_hierarchy ch 
      WHERE ch.id = corporate_financials.corporate_hierarchy_id 
      AND ch.owner_id = auth.uid()
      AND auth.jwt() ->> 'role' = 'OWNER'
    )
  );

-- Owner audit logs access
CREATE POLICY "owner_audit_access" ON owner_audit_logs
  FOR ALL TO authenticated
  USING (owner_id = auth.uid() AND auth.jwt() ->> 'role' = 'OWNER');

-- Location performance metrics access
CREATE POLICY "owner_performance_metrics_access" ON location_performance_metrics
  FOR ALL TO authenticated
  USING (
    auth.jwt() ->> 'role' = 'OWNER' OR
    location_id = (auth.jwt() ->> 'location_id')::uuid
  );

-- Corporate team members access
CREATE POLICY "owner_team_access" ON corporate_team_members
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM corporate_hierarchy ch 
      WHERE ch.id = corporate_team_members.corporate_hierarchy_id 
      AND ch.owner_id = auth.uid()
      AND auth.jwt() ->> 'role' = 'OWNER'
    )
  );

-- Location creation workflows access
CREATE POLICY "owner_creation_workflows_access" ON location_creation_workflows
  FOR ALL TO authenticated
  USING (owner_id = auth.uid() AND auth.jwt() ->> 'role' = 'OWNER');

-- Enable RLS on all new tables
ALTER TABLE corporate_hierarchy ENABLE ROW LEVEL SECURITY;
ALTER TABLE corporate_financials ENABLE ROW LEVEL SECURITY;
ALTER TABLE owner_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE corporate_team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE location_creation_workflows ENABLE ROW LEVEL SECURITY;

-- Indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_corporate_hierarchy_owner ON corporate_hierarchy(owner_id);
CREATE INDEX IF NOT EXISTS idx_locations_owner ON locations(owner_id);
CREATE INDEX IF NOT EXISTS idx_locations_status ON locations(location_status);
CREATE INDEX IF NOT EXISTS idx_corporate_financials_hierarchy ON corporate_financials(corporate_hierarchy_id);
CREATE INDEX IF NOT EXISTS idx_corporate_financials_location ON corporate_financials(location_id);
CREATE INDEX IF NOT EXISTS idx_corporate_financials_period ON corporate_financials(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_owner_audit_logs_owner ON owner_audit_logs(owner_id);
CREATE INDEX IF NOT EXISTS idx_owner_audit_logs_created ON owner_audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_location ON location_performance_metrics(location_id);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_date ON location_performance_metrics(metric_date);
CREATE INDEX IF NOT EXISTS idx_team_members_hierarchy ON corporate_team_members(corporate_hierarchy_id);
CREATE INDEX IF NOT EXISTS idx_creation_workflows_owner ON location_creation_workflows(owner_id);

-- Helper functions for owner operations

-- Function to get all locations for an owner
CREATE OR REPLACE FUNCTION get_owner_locations(owner_user_id uuid)
RETURNS TABLE (
  location_id uuid,
  location_name text,
  location_address text,
  location_status text,
  admin_name text,
  created_at timestamptz
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    l.id,
    l.name,
    l.address,
    l.location_status,
    u.full_name,
    l.created_at
  FROM locations l
  LEFT JOIN auth.users u ON l.admin_id = u.id
  WHERE l.owner_id = owner_user_id
  ORDER BY l.created_at DESC;
END;
$$;

-- Function to calculate corporate analytics
CREATE OR REPLACE FUNCTION get_corporate_analytics(owner_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result jsonb;
  total_locations integer;
  total_revenue decimal(15,2);
  avg_utilization decimal(5,2);
BEGIN
  -- Get basic counts and aggregations
  SELECT 
    COUNT(*),
    COALESCE(SUM(COALESCE((business_config->>'monthly_revenue')::decimal, 0)), 0),
    COALESCE(AVG(COALESCE((business_config->>'utilization_rate')::decimal, 0)), 0)
  INTO total_locations, total_revenue, avg_utilization
  FROM locations 
  WHERE owner_id = owner_user_id AND location_status = 'active';

  -- Build result JSON
  result := jsonb_build_object(
    'total_locations', total_locations,
    'total_revenue', total_revenue,
    'avg_utilization', avg_utilization,
    'growth_rate', 12.5, -- Placeholder for growth calculation
    'last_updated', now()
  );

  RETURN result;
END;
$$;

-- Function to log owner actions
CREATE OR REPLACE FUNCTION log_owner_action(
  owner_user_id uuid,
  action_type text,
  target_location uuid DEFAULT NULL,
  target_user uuid DEFAULT NULL,
  action_details jsonb DEFAULT NULL,
  is_sensitive boolean DEFAULT false
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id uuid;
BEGIN
  INSERT INTO owner_audit_logs (
    owner_id,
    action,
    target_location_id,
    target_user_id,
    action_details,
    sensitive_data_accessed,
    created_at
  ) VALUES (
    owner_user_id,
    action_type,
    target_location,
    target_user,
    action_details,
    is_sensitive,
    now()
  ) RETURNING id INTO log_id;

  RETURN log_id;
END;
$$;

-- Trigger to automatically log location creation
CREATE OR REPLACE FUNCTION trigger_log_location_creation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Log the location creation action
  PERFORM log_owner_action(
    NEW.owner_id,
    'location_created',
    NEW.id,
    NULL,
    jsonb_build_object(
      'location_name', NEW.name,
      'location_address', NEW.address,
      'status', NEW.location_status
    ),
    false
  );
  
  RETURN NEW;
END;
$$;

-- Create trigger for location creation logging
DROP TRIGGER IF EXISTS log_location_creation ON locations;
CREATE TRIGGER log_location_creation
  AFTER INSERT ON locations
  FOR EACH ROW
  EXECUTE FUNCTION trigger_log_location_creation();

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION trigger_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS corporate_hierarchy_updated_at ON corporate_hierarchy;
CREATE TRIGGER corporate_hierarchy_updated_at
  BEFORE UPDATE ON corporate_hierarchy
  FOR EACH ROW
  EXECUTE FUNCTION trigger_updated_at();

DROP TRIGGER IF EXISTS corporate_team_updated_at ON corporate_team_members;
CREATE TRIGGER corporate_team_updated_at
  BEFORE UPDATE ON corporate_team_members
  FOR EACH ROW
  EXECUTE FUNCTION trigger_updated_at();

DROP TRIGGER IF EXISTS location_workflows_updated_at ON location_creation_workflows;
CREATE TRIGGER location_workflows_updated_at
  BEFORE UPDATE ON location_creation_workflows
  FOR EACH ROW
  EXECUTE FUNCTION trigger_updated_at();

-- Sample data insertion for owner testing
-- Note: This should be run only in development environment

DO $$
DECLARE
  sample_owner_id uuid;
  sample_hierarchy_id uuid;
BEGIN
  -- Check if running in development (adjust condition as needed)
  IF current_setting('app.environment', true) = 'development' THEN
    
    -- Create sample owner user (this would normally be done through auth)
    -- This is just for database structure testing
    
    -- Create sample corporate hierarchy
    INSERT INTO corporate_hierarchy (
      owner_id,
      organization_name,
      corporate_settings,
      billing_config
    ) VALUES (
      gen_random_uuid(), -- Replace with actual owner user ID
      'RentAgain Fleet Management',
      jsonb_build_object(
        'default_timezone', 'America/New_York',
        'corporate_branding', jsonb_build_object(
          'primary_color', '#F59E0B',
          'logo_url', '/assets/logo.png'
        )
      ),
      jsonb_build_object(
        'billing_cycle', 'monthly',
        'payment_terms', '30',
        'currency', 'USD'
      )
    ) ON CONFLICT DO NOTHING;

  END IF;
END;
$$;

-- Comments for maintenance
COMMENT ON TABLE corporate_hierarchy IS 'Corporate-level organization structure for multi-location management';
COMMENT ON TABLE corporate_financials IS 'Aggregated financial data across all locations for corporate reporting';
COMMENT ON TABLE owner_audit_logs IS 'Comprehensive audit trail for all owner-level actions and sensitive operations';
COMMENT ON TABLE location_performance_metrics IS 'Daily performance metrics for each location enabling cross-location analytics';
COMMENT ON TABLE corporate_team_members IS 'Corporate-level team management with role assignments and access control';
COMMENT ON TABLE location_creation_workflows IS 'Workflow tracking for new location setup and onboarding';

COMMENT ON FUNCTION get_owner_locations IS 'Retrieves all locations owned by a specific owner with admin details';
COMMENT ON FUNCTION get_corporate_analytics IS 'Calculates real-time corporate analytics across all owned locations';
COMMENT ON FUNCTION log_owner_action IS 'Logs owner actions for audit trail and compliance monitoring';