import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const authRouter = Router();

console.log(authController);
authRouter.get("/",(req, res) =>{
      res.json({
            message : "Auth Route Working"
      });
});

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.post("/refresh", authController.refresh);
authRouter.post("/logout", authController.logout);
authRouter.put("/change-password", authMiddleware, authController.changePassword);
authRouter.put("/update-profile", authMiddleware, authController.updateProfile);
authRouter.get("/sessions", authMiddleware, authController.getSessions);
authRouter.delete("/sessions/:id", authMiddleware, authController.revokeSession);

export default authRouter;