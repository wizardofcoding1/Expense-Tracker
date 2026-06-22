import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import * as groupController from "../controllers/group.controller.js";

const groupRouter = Router();

// Protect all routes under this router
groupRouter.use(authMiddleware);

groupRouter.post("/", groupController.createGroup);
groupRouter.get("/", groupController.getGroups);
groupRouter.delete("/:id", groupController.deleteGroup);
groupRouter.post("/:id/members", groupController.addMember);
groupRouter.post("/:id/expenses", groupController.logExpense);
groupRouter.get("/:id/expenses", groupController.getExpenses);
groupRouter.get("/:id/balances", groupController.getBalances);

export default groupRouter;
