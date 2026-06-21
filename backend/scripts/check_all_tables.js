import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: 'c:/Users/wonde/OneDrive/Desktop/Expense Tracker/backend/.env' });

const { Pool } = pg;
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

async function main() {
  try {
    // 1. List all tables
    const tablesRes = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `);
    console.log('Tables in database:', tablesRes.rows.map(r => r.table_name));

    // 2. Check savings_goals columns if it exists
    const columnsRes = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'savings_goals';
    `);
    console.log('Columns in savings_goals:', columnsRes.rows);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

main();
