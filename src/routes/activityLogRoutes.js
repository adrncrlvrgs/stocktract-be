import express from "express";
import * as activityLogController from "../core/logger/controller.js";
import { authenticate } from "../core/middlewares/middleware.js";

const router = express.Router();

router.post('/log', authenticate, activityLogController.logActivity);
router.get('/', authenticate, activityLogController.getActivityLogs);

export default router;