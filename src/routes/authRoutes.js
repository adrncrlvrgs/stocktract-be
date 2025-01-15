import express from "express";
import * as authController from "../modules/auth/controller.js";
import { authenticate } from "../core/middlewares/middleware.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post(
  "/signup",
  upload.single("profileImagePath"),
  authController.signUp
);
router.post("/login", authController.loginUser);
router.get("/refresh", authController.refreshToken);

router.get("/profile", authenticate, authController.getUserProfileController);

export default router;
