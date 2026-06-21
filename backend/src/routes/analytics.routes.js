import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import * as analyticsController from "../controllers/analytics.controller.js";

const analyticsRouter = Router();

// Protect all routes under this router
analyticsRouter.use(authMiddleware);

analyticsRouter.get("/summary", analyticsController.getSummary);

export default analyticsRouter;
