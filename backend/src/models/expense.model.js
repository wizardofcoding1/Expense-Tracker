import pool from "../config/db.js";

export async function createExpense({
    userId, amount, category, description, date
}){
    const query = `
        insert into expenses (user_id, amount, category, description, date)
        values ($1, $2, $3, $4, coalesce($5, current_date))
        returning *;
    `;

    const values = [userId, amount, category, description, date];
    const result = await pool.query(query, values);

    return result.rows[0];
}


export async function getExpensesByUserId(userId, { startDate, endDate, category } = {}){
    let query = `
        select * from expenses
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
    if (category) {
        query += ` and lower(category) = lower($${paramIndex++})`;
        values.push(category);
    }

    query += ` order by date desc, created_at desc;`;

    const result = await pool.query(query, values);
    return result.rows;
}

export async function getExpenseById(id, userId){
    const query = `
        select * from expenses
        where id = $1 and user_id = $2;
    `;

    const result = await pool.query(query, [id, userId]);
    return result.rows[0];
}

export async function updateExpense(id, userId, {amount, category, description, date}){
    const query = `
        update expenses 
        set 
            amount = coalesce($3, amount),
            category = coalesce($4, category),
            description = coalesce($5, description),
            date = coalesce($6, date),
            updated_at = current_timestamp
        where id = $1 and user_id = $2
        returning *;
    `;

    const values = [id, userId, amount, category, description, date];
    const result = await pool.query(query, values);
    return result.rows[0];
}

export async function deleteExpense(id, userId){
    const query = `
        delete from expenses
        where id = $1 and user_id = $2
        returning *;
    `;

    const result = await pool.query(query, [id, userId]);
    return result.rows[0];
}

export async function getExpenseCategoryTotals(userId) {
    const query = `
        select category, sum(amount) as total_amount 
        from expenses 
        where user_id = $1 
        group by category
        order by total_amount desc;
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
}

export async function createExpensesBulk(userId, expensesArray) {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        
        const inserted = [];
        for (const item of expensesArray) {
            const query = `
                insert into expenses (user_id, amount, category, description, date)
                values ($1, $2, $3, $4, coalesce($5, current_date))
                returning *;
            `;
            const values = [userId, item.amount, item.category, item.description, item.date];
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