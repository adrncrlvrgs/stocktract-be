import express from "express";
import * as user from "../modules/user/controller.js";
import { authenticate } from "../core/middlewares/middleware";

const router = express.Router();

router.post('/addUser', user.createUser);

router.get('/', authenticate, user.getUsers);
router.get('/:userID', authenticate, user.getUser);
router.put('/:userID', authenticate, user.updateUserDetails);
router.delete('/:userID', authenticate, user.removeUser);

export default router;