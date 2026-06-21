import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

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
    const resUsers = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users';
    `);
    console.log('Columns in users table:', resUsers.rows);

    const resExpenses = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'expenses';
    `);
    console.log('Columns in expenses table:', resExpenses.rows);

    const resIncomes = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'incomes';
    `);
    console.log('Columns in incomes table:', resIncomes.rows);

    const resBudgets = await pool.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'budgets';
    `);
    console.log('Columns in budgets table:', resBudgets.rows);

  } catch (err) {
    console.error('Error querying database:', err);
  } finally {
    await pool.end();
  }
}

main();
