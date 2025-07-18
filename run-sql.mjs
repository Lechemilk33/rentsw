import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// Direct connection using your cloud database
const supabaseUrl = 'https://clofjqoroioqfuisetyu.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsb2ZqcW9yb2lvcWZ1aXNldHl1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjU5NTkzMSwiZXhwIjoyMDY4MTcxOTMxfQ.yG_YrtZjEmVAUKLmmfQuERW2b8Nd0igZrrcjzIYROlI'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function executeSQLFile(filename) {
  try {
    console.log(`\n🔄 Executing ${filename}...`)
    
    const sqlContent = readFileSync(filename, 'utf8')
    console.log(`📄 SQL file loaded`)
    
    // Split SQL into individual statements and execute them
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))
    
    console.log(`📊 Found ${statements.length} SQL statements to execute`)
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.trim()) {
        try {
          console.log(`   Executing statement ${i + 1}/${statements.length}...`)
          
          // Use .rpc() for direct SQL execution
          const { data, error } = await supabase.rpc('exec_sql', { 
            query: statement + ';' 
          })
          
          if (error) {
            console.error(`   ❌ Statement ${i + 1} error:`, error.message)
            // Continue with other statements
          } else {
            console.log(`   ✅ Statement ${i + 1} completed`)
          }
        } catch (err) {
          console.error(`   ❌ Statement ${i + 1} failed:`, err.message)
        }
      }
    }
    
  } catch (error) {
    console.error(`❌ Failed to execute ${filename}:`, error.message)
  }
}

const filename = process.argv[2]
if (!filename) {
  console.error('Usage: node run-sql.mjs <filename.sql>')
  process.exit(1)
}

executeSQLFile(filename)
