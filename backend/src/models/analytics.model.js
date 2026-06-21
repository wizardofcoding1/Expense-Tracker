import pool from "../config/db.js";

export async function getMonthlySummaryQuery(userId, month, year) {
      const query = `
            SELECT 
                  (
                        SELECT COALESCE(SUM(amount), 0) 
                        FROM incomes 
                        WHERE user_id = $1 
                          AND EXTRACT(MONTH FROM date) = $2 
                          AND EXTRACT(YEAR FROM date) = $3
                  ) as total_income,
                  (
                        SELECT COALESCE(SUM(amount), 0) 
                        FROM expenses 
                        WHERE user_id = $1 
                          AND EXTRACT(MONTH FROM date) = $2 
                          AND EXTRACT(YEAR FROM date) = $3
                  ) as total_expense;
      `;
      const values = [userId, month, year];
      const result = await pool.query(query, values);
      return result.rows[0];
}
