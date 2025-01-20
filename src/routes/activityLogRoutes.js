import express from "express";
import * as activityLogController from "../modules/activity-logs/controller.js";
import { authenticate } from "../core/middlewares/middleware.js";

const router = express.Router();

router.post('/addlog', authenticate, activityLogController.createLogActivity);
router.get('/', authenticate, activityLogController.getAllActivityLogs);

export default router;