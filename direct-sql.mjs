import pg from 'pg'
import { readFileSync } from 'fs'

const { Client } = pg

// Direct PostgreSQL connection to Supabase
const client = new Client({
  host: 'aws-0-us-west-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.clofjqoroioqfuisetyu',
  password: 'RentAgain2024!', // You'll need to replace this with your actual password
  ssl: true
})

async function executeSQLFile(filename) {
  try {
    console.log(`\n🔄 Connecting to database...`)
    await client.connect()
    console.log(`✅ Connected!`)
    
    console.log(`📄 Reading ${filename}...`)
    const sqlContent = readFileSync(filename, 'utf8')
    
    console.log(`⏳ Executing SQL...`)
    const result = await client.query(sqlContent)
    
    console.log(`✅ Successfully executed ${filename}`)
    console.log(`📊 Result:`, result.rowCount || 'Command completed')
    
  } catch (error) {
    console.error(`❌ Error executing ${filename}:`, error.message)
  } finally {
    await client.end()
  }
}

const filename = process.argv[2]
if (!filename) {
  console.error('Usage: node direct-sql.mjs <filename.sql>')
  process.exit(1)
}

executeSQLFile(filename)
