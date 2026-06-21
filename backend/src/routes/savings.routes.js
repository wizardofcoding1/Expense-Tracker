import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import * as savingsController from "../controllers/savings.controller.js";

const savingsRouter = Router();

// Protect all routes under this router
savingsRouter.use(authMiddleware);

savingsRouter.post("/", savingsController.addGoal);
savingsRouter.get("/", savingsController.getGoals);
savingsRouter.get("/:id", savingsController.getGoalDetails);
savingsRouter.put("/:id", savingsController.editGoal);
savingsRouter.put("/:id/contribute", savingsController.contributeToGoal);
savingsRouter.delete("/:id", savingsController.removeGoal);

export default savingsRouter;
