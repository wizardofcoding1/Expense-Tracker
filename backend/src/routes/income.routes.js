import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import * as incomeController from "../controllers/income.controller.js";

const incomeRouter = Router();

// Protect all routes under this router
incomeRouter.use(authMiddleware);

incomeRouter.post("/", incomeController.addIncome);
incomeRouter.get("/", incomeController.getIncomes);
incomeRouter.post("/bulk", incomeController.addIncomesBulk);
incomeRouter.get("/:id", incomeController.getIncomeDetails);
incomeRouter.put("/:id", incomeController.editIncome);
incomeRouter.delete("/:id", incomeController.removeIncome);

export default incomeRouter;
