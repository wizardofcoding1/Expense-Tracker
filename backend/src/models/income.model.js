import pool from "../config/db.js";


// create income
export async function createIncome(
      {userId, amount, source, description, date}
){
      const query = `
            insert into incomes(user_id, amount, source, description, date)
            values ($1, $2, $3, $4, coalesce($5, current_date))
            returning *;
      `;

      const values = [userId, amount, source, description, date];

      const result = await pool.query(query, values);
      return result.rows[0];
}


// get income by id with filters
export async function getIncomesByUserId(userId, { startDate, endDate, source } = {}){
      let query = `
            select * from incomes
            where user_id = $1
      `;
      const values = [userId];
      let paramIndex = 2;

      if (startDate) {
            query += ` and date >= $${paramIndex++}`;
            values.push(startDate);
      }
      if (endDate) {
            query += ` and date <= $${paramIndex++}`;
            values.push(endDate);
      }
      if (source) {
            query += ` and lower(source) = lower($${paramIndex++})`;
            values.push(source);
      }

      query += ` order by date desc, created_at desc;`;

      const result = await pool.query(query, values);
      return result.rows;
}

// Get Income
export async function getIncomeById(id, userId){
      const query = `
            select * from incomes
            where id = $1 and user_id = $2;
      `;

      const result = await pool.query(query, [id, userId]);
      return result.rows[0];
}

// update income
export async function updateIncome(id, userId, {amount, source, description, date}){
      const query =`
            update incomes 
            set
                  amount = coalesce($3, amount),
                  source = coalesce($4, source),
                  description = coalesce($5, description),
                  date = coalesce($6, date),
                  updated_at = current_timestamp
            where id = $1 and user_id = $2
            returning *;
      `;

      const values = [id, userId, amount, source, description, date];
      const result = await pool.query(query, values);
      return result.rows[0];
}


export async function deleteIncome(id, userId) {
      const query = `
            DELETE FROM incomes 
            WHERE id = $1 AND user_id = $2
            RETURNING *;
      `;
      const result = await pool.query(query, [id, userId]);
      return result.rows[0];
}

export async function createIncomesBulk(userId, incomesArray) {
      const client = await pool.connect();
      try {
            await client.query("BEGIN");
            
            const inserted = [];
            for (const item of incomesArray) {
                  const query = `
                        insert into incomes (user_id, amount, source, description, date)
                        values ($1, $2, $3, $4, coalesce($5, current_date))
                        returning *;
                  `;
                  const values = [userId, item.amount, item.source, item.description, item.date];
                  const res = await client.query(query, values);
                  inserted.push(res.rows[0]);
            }

            await client.query("COMMIT");
            return inserted;
      } catch (error) {
            await client.query("ROLLBACK");
            throw error;
      } finally {
            client.release();
      }
}


