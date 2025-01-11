import express from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import itemRoutes from "./itemsRoutes.js";
import salesRoutes from "./salesRoutes.js";
import stockRoutes from "./stockRoutes.js";
import activityLogRoutes from "./activityLogRoutes.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/category", categoryRoutes);
router.use("/items", itemRoutes);
router.use("/sales", salesRoutes);
router.use("/stocks", stockRoutes);
router.use("/logs", activityLogRoutes);

export default router;
