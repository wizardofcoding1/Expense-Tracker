import pool from "../config/db.js";

export async function createGoal({ userId, name, targetAmount, deadline }) {
      const query = `
            INSERT INTO savings_goals (user_id, name, target_amount, current_amount, deadline)
            VALUES ($1, $2, $3, 0.00, $4)
            RETURNING *;
      `;
      const values = [userId, name.trim(), targetAmount, deadline || null];
      const result = await pool.query(query, values);
      return result.rows[0];
}

export async function getGoalsByUserId(userId) {
      const query = `
            SELECT * FROM savings_goals 
            WHERE user_id = $1 
            ORDER BY created_at DESC;
      `;
      const result = await pool.query(query, [userId]);
      return result.rows;
}

export async function getGoalById(id, userId) {
      const query = `
            SELECT * FROM savings_goals 
            WHERE id = $1 AND user_id = $2;
      `;
      const result = await pool.query(query, [id, userId]);
      return result.rows[0];
}

export async function updateGoal(id, userId, { name, targetAmount, currentAmount, deadline }) {
      const query = `
            UPDATE savings_goals
            SET 
                  name = COALESCE($3, name),
                  target_amount = COALESCE($4, target_amount),
                  current_amount = COALESCE($5, current_amount),
                  deadline = COALESCE($6, deadline),
                  updated_at = CURRENT_TIMESTAMP
            WHERE id = $1 AND user_id = $2
            RETURNING *;
      `;
      const values = [id, userId, name, targetAmount, currentAmount, deadline];
      const result = await pool.query(query, values);
      return result.rows[0];
}

export async function deleteGoal(id, userId) {
      const query = `
            DELETE FROM savings_goals 
            WHERE id = $1 AND user_id = $2
            RETURNING *;
      `;
      const result = await pool.query(query, [id, userId]);
      return result.rows[0];
}
