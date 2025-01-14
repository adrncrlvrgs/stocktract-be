import express from "express";
import * as user from "../modules/user/controller.js";
import { authenticate, authorize } from "../core/middlewares/middleware.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post(
  "/addUser",
  authenticate,
  authorize("admin"),
  upload.single("profileImagePath"),
  user.create
);
router.get("/", authenticate, authorize(["admin"]), user.getUsers);
router.get("/:userID", authenticate, authorize(["admin"]), user.getUser);
router.put(
  "/:userID",
  authenticate,
  authorize(["admin"]),
  upload.single("profileImagePath"),
  user.updateUserDetails
);
router.delete("/:userID", authenticate, authorize(["admin"]), user.removeUser);

export default router;
