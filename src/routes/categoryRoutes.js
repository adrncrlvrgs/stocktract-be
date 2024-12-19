import express from "express";
import * as category from "../modules/item-category/controller.js";
import { authenticate } from "../core/middlewares/middleware.js";

const router = express.Router();

router.post('/addCategory', authenticate, category.create);
// router.get('/', authenticate, user.getUsers);
// router.get('/:userID', authenticate, user.getUser);
// router.put('/:userID', authenticate, user.updateUserDetails);
// router.delete('/:userID', authenticate, user.removeUser);

export default router;