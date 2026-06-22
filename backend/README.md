# FinTrack Backend API

FinTrack Backend is a secure, RESTful API built on **Node.js**, **Express**, and **PostgreSQL** that serves as the engine for the FinTrack Expense Tracker application. It handles user authentication, session management, transaction logging (expenses/incomes), budget allocations, savings targets, shared group bills, and financial analytics.

---

## Technical Stack & Architecture

- **Runtime Environment:** Node.js (ES Modules import syntax)
- **Web Framework:** Express.js
- **Database:** PostgreSQL (Cloud instance e.g., Neon Postgres)
- **Database Driver:** `pg` (node-postgres) with connection pooling
- **Security & Password Hashing:** `bcrypt`
- **Authentication:** Dual Token JWT (short-lived JSON Web Tokens for Access and long-lived tokens for Refresh, combined with database-tracked active device sessions)
- **Logging Middleware:** `morgan`
- **Configuration Management:** `dotenv`

---

## Database Schema (PostgreSQL)

The backend auto-initializes and interacts with the following relational database tables:

1. **`users`**
   - Stores user credentials, profiles, and hashed passwords.
   - Core fields: `id` (UUID), `first_name`, `last_name`, `email` (unique), `password_hash`, `created_at`.

2. **`user_sessions`** *(Auto-initialized on start)*
   - Tracks active refresh tokens and user device details for session revocation.
   - Core fields: `id`, `user_id` (foreign key), `token_id` (unique), `device_name`, `browser`, `os`, `ip_address`, `last_active`, `created_at`.

3. **`expenses`**
   - Logs user-logged expense transactions.
   - Core fields: `id`, `user_id` (foreign key), `amount` (numeric), `category`, `description`, `date`, `created_at`.

4. **`incomes`**
   - Logs user-logged income transactions.
   - Core fields: `id`, `user_id` (foreign key), `amount` (numeric), `source` (maps to category in client), `description`, `date`, `created_at`.

5. **`budgets`**
   - Configures spending limits for specific categories per month/year.
   - Core fields: `id`, `user_id` (foreign key), `category`, `limit_amount`, `month`, `year`, `updated_at`.

6. **`savings_goals`** & **`savings_contributions`**
   - Manages savings targets and tracks historical deposits toward those targets.

7. **`groups`**, **`group_members`**, & **`group_expenses`**
   - Supports shared bill split features, balance calculation, and settle-up transactions.

---

## REST API Endpoints

### 1. Authentication (`/api/auth`)
- **`POST /register`**: Register a new user.
- **`POST /login`**: Validate credentials and return JWT tokens (Access and Refresh token inside cookies).
- **`POST /logout`**: Invalidate the session and clear cookies.
- **`POST /refresh`**: Use refresh token cookie to issue a new Access Token.
- **`GET /sessions`**: List active login sessions/devices for the user.
- **`DELETE /sessions/:id`**: Revoke a specific session, forcing that device to log out.
- **`PUT /change-password`**: Update user password.
- **`PUT /update-profile`**: Update user profile details (First Name, Last Name, Gender, Date of Birth).

### 2. Expenses (`/api/expenses`)
- **`POST /`**: Log a new expense transaction.
- **`GET /`**: Fetch all logged expenses (supports date range, category, and limit query filters).
- **`PUT /:id`**: Update an expense transaction.
- **`DELETE /:id`**: Delete an expense transaction.
- **`GET /category-totals`**: Returns total spent grouped by category.

### 3. Incomes (`/api/incomes`)
- **`POST /`**: Log a new income transaction.
- **`GET /`**: Retrieve logged incomes.
- **`PUT /:id`**: Update an income transaction.
- **`DELETE /:id`**: Remove an income transaction.

### 4. Category Limits & Budgets (`/api/budgets`)
- **`POST /`**: Create or update a budget limit for a category (month/year specified).
- **`GET /status`**: Compare user budget limits against actual spent category totals for the month/year.
- **`GET /compare`**: Fetch budget performance details relative to prior months.

### 5. Savings Goals (`/api/savings`)
- **`POST /`**: Create a new savings target goal.
- **`GET /`**: List all current savings goals.
- **`POST /:id/contributions`**: Record a deposit/contribution toward a goal.
- **`DELETE /:id`**: Remove a savings target.

### 6. Group Bill Splits (`/api/groups`)
- **`POST /`**: Create a new shared expense group.
- **`GET /`**: Fetch list of user's active groups.
- **`POST /:id/members`**: Add a member to a group (supports registered email or guest name).
- **`GET /:id/expenses`**: View list of group expenses and balances.
- **`POST /:id/expenses`**: Log a group bill split (accepts custom payer `paidBy` and transaction `date`).
- **`POST /:id/settle`**: Settle outstanding group dues.
- **`DELETE /:id`**: Delete a shared expense group (creator only, cascade deletes splits, expenses, and members).

### 7. Financial Analytics (`/api/analytics`)
- **`GET /summary`**: Calculate monthly financial metrics (Total Income, Total Expense, Savings Rate).
- **`GET /category-trend`**: Category spending trend over months.
- **`GET /monthly-trend`**: Multi-month total income/expense trend comparison.

---

## Local Setup & Installation

### Prerequisite
Make sure you have [Node.js](https://nodejs.org) and [PostgreSQL](https://www.postgresql.org/) installed locally (or access to a cloud hosted Neon database).

### 1. Install Dependencies
Navigate into the backend folder and install the node packages:
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root of the `backend` folder:
```env
PORT=4000
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<dbname>?sslmode=require
JWT_ACCESS_SECRET=your_jwt_access_secret_key_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
```

### 3. Run Database Initialization
Ensure your database server is running. The server auto-migrates and instantiates the necessary table structures (like `user_sessions`) upon the first startup.

### 4. Running the Dev Server
Launch the server in watch mode using `nodemon`:
```bash
npm run dev
```
The server will start listening at `http://localhost:4000`.
