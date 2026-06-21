import pool from "../config/db.js";

export async function upsertBudget({ userId, category, limitAmount, month, year }) {
      const query = `
            INSERT INTO budgets (user_id, category, limit_amount, month, year, updated_at)
            VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
            ON CONFLICT (user_id, category, month, year)
            DO UPDATE SET limit_amount = EXCLUDED.limit_amount, updated_at = CURRENT_TIMESTAMP
            RETURNING *;
      `;
      const values = [userId, category.trim(), limitAmount, month, year];
      const result = await pool.query(query, values);
      return result.rows[0];
}

export async function getBudgetsByUserId(userId, month, year) {
      const query = `
            SELECT * FROM budgets 
            WHERE user_id = $1 AND month = $2 AND year = $3
            ORDER BY category ASC;
      `;
      const result = await pool.query(query, [userId, month, year]);
      return result.rows;
}

export async function getBudgetStatusQuery(userId, month, year) {
      // Calculates spent totals by category for the given month & year and matches with budgets
      const query = `
            SELECT 
                  b.id,
                  b.category,
                  b.limit_amount,
                  COALESCE(e.spent_amount, 0) as spent_amount,
                  b.limit_amount - COALESCE(e.spent_amount, 0) as remaining_amount
            FROM budgets b
            LEFT JOIN (
                  SELECT LOWER(category) as category_lower, SUM(amount) as spent_amount
                  FROM expenses
                  WHERE user_id = $1
                    AND EXTRACT(MONTH FROM date) = $2
                    AND EXTRACT(YEAR FROM date) = $3
                  GROUP BY category_lower
            ) e ON LOWER(b.category) = e.category_lower
            WHERE b.user_id = $1 AND b.month = $2 AND b.year = $3
            ORDER BY b.category ASC;
      `;
      const result = await pool.query(query, [userId, month, year]);
      return result.rows;
}

export async function compareExpensesToBudgetQuery(userId, { spentMonth, spentYear, compareMonth, compareYear }) {
      const query = `
            SELECT 
                  COALESCE(e.category, b.category) as category,
                  COALESCE(e.spent_amount, 0) as spent_amount,
                  COALESCE(b.limit_amount, 0) as budget_limit,
                  COALESCE(e.spent_amount, 0) - COALESCE(b.limit_amount, 0) as difference
            FROM (
                  SELECT category, SUM(amount) as spent_amount
                  FROM expenses
                  WHERE user_id = $1
                    AND EXTRACT(MONTH FROM date) = $2
                    AND EXTRACT(YEAR FROM date) = $3
                  GROUP BY category
            ) e
            FULL OUTER JOIN (
                  SELECT category, limit_amount
                  FROM budgets
                  WHERE user_id = $1
                    AND month = $4
                    AND year = $5
            ) b ON LOWER(e.category) = LOWER(b.category)
            ORDER BY category ASC;
      `;
      const values = [userId, spentMonth, spentYear, compareMonth, compareYear];
      const result = await pool.query(query, values);
      return result.rows;
}
