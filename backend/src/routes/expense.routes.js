import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import * as expenseController from "../controllers/expense.controller.js";

const expenseRouter = Router();

// Protect all routes under this router
expenseRouter.use(authMiddleware);

expenseRouter.post("/", expenseController.addExpense);
expenseRouter.get("/", expenseController.getExpenses);
expenseRouter.get("/category-totals", expenseController.getCategoryTotals);
expenseRouter.post("/bulk", expenseController.addExpensesBulk);
expenseRouter.get("/:id", expenseController.getExpenseDetails);
expenseRouter.put("/:id", expenseController.editExpense);
expenseRouter.delete("/:id", expenseController.removeExpense);

export default expenseRouter;
