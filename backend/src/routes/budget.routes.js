import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import * as budgetController from "../controllers/budget.controller.js";

const budgetRouter = Router();

// Protect all routes under this router
budgetRouter.use(authMiddleware);

budgetRouter.post("/", budgetController.setBudget);
budgetRouter.get("/", budgetController.getBudgets);
budgetRouter.get("/status", budgetController.getBudgetStatus);
budgetRouter.get("/compare", budgetController.compareBudgets);

export default budgetRouter;
