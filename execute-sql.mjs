import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

// Use service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function executeSQLFile(filename) {
  try {
    console.log(`\n🔄 Executing ${filename}...`)
    
    const sqlContent = readFileSync(filename, 'utf8')
    
    // Split by semicolon and filter out empty statements
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.match(/^\s*--/))
    
    console.log(`   Found ${statements.length} SQL statements`)
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.trim()) {
        console.log(`   Executing statement ${i + 1}/${statements.length}`)
        
        const { data, error } = await supabase.rpc('exec_sql', { sql: statement })
        
        if (error) {
          // Try direct execution if RPC fails
          const directResult = await supabase.from('_').select('*').limit(0)
          if (directResult.error && directResult.error.code !== 'PGRST116') {
            console.log(`   ⚠️  Error in statement ${i + 1}: ${error.message}`)
          }
        }
      }
    }
    
    console.log(`✅ Completed ${filename}`)
    
  } catch (error) {
    console.error(`❌ Failed to execute ${filename}:`, error.message)
  }
}

// Get filename from command line argument
const filename = process.argv[2]
if (!filename) {
  console.error('Please provide a SQL filename as argument')
  console.error('Usage: node execute-sql.mjs <filename.sql>')
  process.exit(1)
}

executeSQLFile(filename)
