import express from "express";
import * as user from "../modules/user/controller.js";
import { authenticate } from "../core/middlewares/middleware.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/addUser', authenticate, upload.single("profileImagePath"), user.create);
router.get('/', authenticate, user.getUsers);
router.get('/:userID', authenticate, user.getUser);
router.put('/:userID', authenticate, upload.single("profileImagePath"), user.updateUserDetails);
router.delete('/:userID', authenticate, user.removeUser);

export default router;