const { createClient } = require('@supabase/supabase-js');

// Load environment variables manually
const fs = require('fs');
const envFile = fs.readFileSync('.env', 'utf8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const supabase = createClient(
  envVars.VITE_SUPABASE_URL,
  envVars.VITE_SUPABASE_ANON_KEY
);

async function checkDatabase() {
  console.log('🔍 Checking database schema...\n');
  
  try {
    // Check locations table
    console.log('1. Checking locations table...');
    const { data: locData, error: locError } = await supabase
      .from('locations')
      .select('*')
      .limit(1);
    
    if (locError) {
      console.log('❌ Locations table error:', locError.message);
    } else {
      console.log('✅ Locations table exists');
      if (locData && locData.length > 0) {
        console.log('   Columns:', Object.keys(locData[0]).join(', '));
      } else {
        console.log('   Table exists but is empty');
      }
    }
    
    // Check corporate_hierarchy table
    console.log('\n2. Checking corporate_hierarchy table...');
    const { data: corpData, error: corpError } = await supabase
      .from('corporate_hierarchy')
      .select('*')
      .limit(1);
    
    if (corpError) {
      console.log('❌ Corporate hierarchy table does not exist');
      console.log('   Error:', corpError.message);
    } else {
      console.log('✅ Corporate hierarchy table exists');
      if (corpData && corpData.length > 0) {
        console.log('   Columns:', Object.keys(corpData[0]).join(', '));
      } else {
        console.log('   Table exists but is empty');
      }
    }
    
    // Check owner_audit_logs table
    console.log('\n3. Checking owner_audit_logs table...');
    const { data: auditData, error: auditError } = await supabase
      .from('owner_audit_logs')
      .select('*')
      .limit(1);
    
    if (auditError) {
      console.log('❌ Owner audit logs table does not exist');
      console.log('   Error:', auditError.message);
    } else {
      console.log('✅ Owner audit logs table exists');
    }
    
    // Check location_performance_metrics table
    console.log('\n4. Checking location_performance_metrics table...');
    const { data: perfData, error: perfError } = await supabase
      .from('location_performance_metrics')
      .select('*')
      .limit(1);
    
    if (perfError) {
      console.log('❌ Location performance metrics table does not exist');
      console.log('   Error:', perfError.message);
    } else {
      console.log('✅ Location performance metrics table exists');
    }
    
    // Check if locations table has the new owner columns
    console.log('\n5. Checking if locations table has owner columns...');
    const { data: locStructure, error: structError } = await supabase
      .from('locations')
      .select('owner_id, corporate_hierarchy_id, location_status, business_config')
      .limit(1);
    
    if (structError) {
      console.log('❌ New owner columns do not exist in locations table');
      console.log('   Error:', structError.message);
    } else {
      console.log('✅ Locations table has been enhanced with owner columns');
    }
    
    console.log('\n📊 Database Schema Status Summary:');
    console.log('=====================================');
    if (locError) console.log('❌ Basic locations table - MISSING');
    else console.log('✅ Basic locations table - EXISTS');
    
    if (corpError) console.log('❌ Corporate hierarchy table - MISSING');
    else console.log('✅ Corporate hierarchy table - EXISTS');
    
    if (auditError) console.log('❌ Owner audit logs table - MISSING');
    else console.log('✅ Owner audit logs table - EXISTS');
    
    if (perfError) console.log('❌ Performance metrics table - MISSING');
    else console.log('✅ Performance metrics table - EXISTS');
    
    if (structError) console.log('❌ Enhanced locations columns - MISSING');
    else console.log('✅ Enhanced locations columns - EXISTS');
    
    if (corpError || auditError || perfError || structError) {
      console.log('\n🚨 CONCLUSION: Owner panel database schema has NOT been applied to Supabase');
      console.log('   You need to run the SQL migration scripts in Supabase.');
    } else {
      console.log('\n🎉 CONCLUSION: Owner panel database schema is fully applied!');
    }
    
  } catch (err) {
    console.error('❌ Connection error:', err.message);
  }
}

checkDatabase();
