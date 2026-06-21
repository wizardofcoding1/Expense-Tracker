import pool from "../config/db.js"

export async function createUser(userData){

      const query =`
            insert into users(
                  first_name,
                  last_name,
                  date_of_birth,
                  gender,
                  email,
                  password_hash
            )
            values($1, $2, $3, $4, $5, $6)
            returning *;
      `;


      const values = [
            userData.firstName,
            userData.lastName,
            userData.dateOfBirth,
            userData.gender,
            userData.email,
            userData.passwordHash,
      ];

      const result = await pool.query(query, values);
      return result.rows[0];
}

export async function getUserByEmail(email){
      const result = await pool.query(
            "select * from users where email =$1",
            [email]
      );

      return result.rows[0];
}

export async function updateUserPassword(userId, passwordHash) {
      const result = await pool.query(
            "UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING *",
            [passwordHash, userId]
      );
      return result.rows[0];
}

export async function getUserById(userId) {
      const result = await pool.query(
            "SELECT * FROM users WHERE id = $1",
            [userId]
      );
      return result.rows[0];
}

export async function updateUser(userId, userData) {
      const query = `
            UPDATE users
            SET first_name = $1,
                last_name = $2,
                date_of_birth = $3,
                gender = $4
            WHERE id = $5
            RETURNING *;
      `;
      const values = [
            userData.firstName,
            userData.lastName,
            userData.dateOfBirth,
            userData.gender,
            userId
      ];
      const result = await pool.query(query, values);
      return result.rows[0];
}
