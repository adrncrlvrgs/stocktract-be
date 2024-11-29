import express from "express";
import * as authController from "../modules/auth/controller.js";
import { authenticate } from "../core/middlewares/middleware.js";

const router = express.Router();

router.post("/signup", authController.signUp);
router.post("/login", authController.loginUser);
router.get("/refresh", authController.refreshToken);

router.get("/profile", authenticate, authController.getUserProfileController);

export default router;
