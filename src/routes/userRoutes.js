import { Router } from "express";
import { getAllUsers } from "../controllers/userController.js"
import authMiddleware from "../middlewares/authMiddleware.js";

const router = Router();

router.get("/", authMiddleware, getAllUsers);

export default router;
