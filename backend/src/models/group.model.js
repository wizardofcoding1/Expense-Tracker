import pool from "../config/db.js";

export async function createGroup(name, description, creatorId) {
      const client = await pool.connect();
      try {
            await client.query("BEGIN");

            // 1. Create the group
            const groupQuery = `
                  INSERT INTO groups (name, description, created_by)
                  VALUES ($1, $2, $3)
                  RETURNING *;
            `;
            const groupResult = await client.query(groupQuery, [name.trim(), description || null, creatorId]);
            const group = groupResult.rows[0];

            // 2. Automatically add the creator as a group member
            const memberQuery = `
                  INSERT INTO group_members (group_id, user_id)
                  VALUES ($1, $2);
            `;
            await client.query(memberQuery, [group.id, creatorId]);

            await client.query("COMMIT");
            return group;
      } catch (error) {
            await client.query("ROLLBACK");
            throw error;
      } finally {
            client.release();
      }
}

export async function addMemberToGroup(groupId, userId) {
      const query = `
            INSERT INTO group_members (group_id, user_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING
            RETURNING *;
      `;
      const result = await pool.query(query, [groupId, userId]);
      return result.rows[0];
}

export async function getGroupsByUserId(userId) {
      const query = `
            SELECT g.* 
            FROM groups g
            JOIN group_members gm ON g.id = gm.group_id
            WHERE gm.user_id = $1
            ORDER BY g.created_at DESC;
      `;
      const result = await pool.query(query, [userId]);
      return result.rows;
}

export async function getGroupMembers(groupId) {
      const query = `
            SELECT u.id, u.first_name, u.last_name, u.email
            FROM group_members gm
            JOIN users u ON gm.user_id = u.id
            WHERE gm.group_id = $1
            ORDER BY u.first_name ASC;
      `;
      const result = await pool.query(query, [groupId]);
      return result.rows;
}

export async function createGroupExpense({ groupId, paidBy, amount, description, date }) {
      const query = `
            INSERT INTO group_expenses (group_id, paid_by, amount, description, date)
            VALUES ($1, $2, $3, $4, COALESCE($5, CURRENT_DATE))
            RETURNING *;
      `;
      const values = [groupId, paidBy, amount, description.trim(), date];
      const result = await pool.query(query, values);
      return result.rows[0];
}

export async function createExpenseSplit(groupExpenseId, userId, owedAmount) {
      const query = `
            INSERT INTO group_expense_splits (group_expense_id, user_id, owed_amount)
            VALUES ($1, $2, $3)
            RETURNING *;
      `;
      const result = await pool.query(query, [groupExpenseId, userId, owedAmount]);
      return result.rows[0];
}

export async function getGroupExpenses(groupId) {
      const query = `
            SELECT ge.*, u.first_name as paid_by_first_name, u.last_name as paid_by_last_name
            FROM group_expenses ge
            JOIN users u ON ge.paid_by = u.id
            WHERE ge.group_id = $1
            ORDER BY ge.date DESC, ge.created_at DESC;
      `;
      const result = await pool.query(query, [groupId]);
      return result.rows;
}

export async function getGroupNetBalances(groupId) {
      const query = `
            SELECT 
                  m.user_id,
                  u.first_name,
                  u.last_name,
                  u.email,
                  COALESCE(p.paid_amount, 0) as paid_amount,
                  COALESCE(o.owed_amount, 0) as owed_amount,
                  COALESCE(p.paid_amount, 0) - COALESCE(o.owed_amount, 0) as net_balance
            FROM group_members m
            JOIN users u ON m.user_id = u.id
            LEFT JOIN (
                  SELECT paid_by, SUM(amount) as paid_amount
                  FROM group_expenses
                  WHERE group_id = $1
                  GROUP BY paid_by
            ) p ON m.user_id = p.paid_by
            LEFT JOIN (
                  SELECT s.user_id, SUM(s.owed_amount) as owed_amount
                  FROM group_expense_splits s
                  JOIN group_expenses ge ON s.group_expense_id = ge.id
                  WHERE ge.group_id = $1
                  GROUP BY s.user_id
            ) o ON m.user_id = o.user_id
            WHERE m.group_id = $1;
      `;
      const result = await pool.query(query, [groupId]);
      return result.rows;
}

export async function deleteGroup(groupId, userId) {
      const client = await pool.connect();
      try {
            await client.query("BEGIN");

            // 1. Verify the user is the creator of the group
            const checkQuery = "SELECT created_by FROM groups WHERE id = $1";
            const checkRes = await client.query(checkQuery, [groupId]);
            if (checkRes.rows.length === 0) {
                  throw new Error("Group not found");
            }
            if (checkRes.rows[0].created_by !== userId) {
                  throw new Error("Only the group creator can delete the group");
            }

            // 2. Delete splits first (where group_expense_id belongs to the group)
            const deleteSplitsQuery = `
                  DELETE FROM group_expense_splits
                  WHERE group_expense_id IN (
                        SELECT id FROM group_expenses WHERE group_id = $1
                  );
            `;
            await client.query(deleteSplitsQuery, [groupId]);

            // 3. Delete expenses
            const deleteExpensesQuery = "DELETE FROM group_expenses WHERE group_id = $1";
            await client.query(deleteExpensesQuery, [groupId]);

            // 4. Delete members
            const deleteMembersQuery = "DELETE FROM group_members WHERE group_id = $1";
            await client.query(deleteMembersQuery, [groupId]);

            // 5. Delete group
            const deleteGroupQuery = "DELETE FROM groups WHERE id = $1";
            await client.query(deleteGroupQuery, [groupId]);

            await client.query("COMMIT");
      } catch (error) {
            await client.query("ROLLBACK");
            throw error;
      } finally {
            client.release();
      }
}
