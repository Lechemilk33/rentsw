-- Maintenance Entries Table Schema
-- Professional vehicle maintenance logging system

-- Create maintenance_entries table
CREATE TABLE IF NOT EXISTS maintenance_entries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
    entry_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    mileage INTEGER NOT NULL,
    maintenance_type VARCHAR(20) NOT NULL CHECK (maintenance_type IN ('routine', 'emergency', 'preventive', 'inspection')),
    work_performed TEXT NOT NULL,
    parts_used TEXT[] DEFAULT '{}',
    labor_hours DECIMAL(4,2) NOT NULL DEFAULT 0,
    cost DECIMAL(10,2) NOT NULL DEFAULT 0,
    technician VARCHAR(100) NOT NULL,
    next_service_due DATE,
    next_service_mileage INTEGER,
    notes TEXT,
    location_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_maintenance_entries_vehicle_id ON maintenance_entries(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_entries_location_id ON maintenance_entries(location_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_entries_entry_date ON maintenance_entries(entry_date);
CREATE INDEX IF NOT EXISTS idx_maintenance_entries_maintenance_type ON maintenance_entries(maintenance_type);

-- Enable RLS (Row Level Security)
ALTER TABLE maintenance_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for multi-tenant access
CREATE POLICY "Users can view maintenance entries for their location" ON maintenance_entries
    FOR SELECT USING (location_id = (auth.jwt() ->> 'location_id')::UUID);

CREATE POLICY "Users can insert maintenance entries for their location" ON maintenance_entries
    FOR INSERT WITH CHECK (location_id = (auth.jwt() ->> 'location_id')::UUID);

CREATE POLICY "Users can update maintenance entries for their location" ON maintenance_entries
    FOR UPDATE USING (location_id = (auth.jwt() ->> 'location_id')::UUID);

CREATE POLICY "Users can delete maintenance entries for their location" ON maintenance_entries
    FOR DELETE USING (location_id = (auth.jwt() ->> 'location_id')::UUID);

-- Create trigger for updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_maintenance_entries_updated_at 
    BEFORE UPDATE ON maintenance_entries 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Sample data can be added after deployment if needed
-- Note: Removing the hardcoded INSERT statements as they depend on specific vehicle IDs