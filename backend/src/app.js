import express from "express"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import config from "./config/config.js"

const app = express()


app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// Custom CORS middleware
app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", config.FRONTEND_URL || "http://localhost:5173");
      res.header("Access-Control-Allow-Credentials", "true");
      res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
      if (req.method === "OPTIONS") {
            return res.sendStatus(200);
      }
      next();
});


import authRouter from "./routes/auth.routes.js";
import incomeRouter from "./routes/income.routes.js";
import expenseRouter from "./routes/expense.routes.js";
import budgetRouter from "./routes/budget.routes.js";
import analyticsRouter from "./routes/analytics.routes.js";
import savingsRouter from "./routes/savings.routes.js";
import groupRouter from "./routes/group.routes.js";

app.use("/api/auth", authRouter)
app.use("/api/incomes", incomeRouter)
app.use("/api/expenses", expenseRouter)
app.use("/api/budgets", budgetRouter)
app.use("/api/analytics", analyticsRouter)
app.use("/api/savings-goals", savingsRouter)
app.use("/api/groups", groupRouter)



export default app;