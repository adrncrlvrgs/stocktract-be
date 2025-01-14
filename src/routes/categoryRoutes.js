import express from "express";
import * as category from "../modules/item-category/controller.js";
import { authenticate, authorize } from "../core/middlewares/middleware.js";

const router = express.Router();

router.post(
  "/addCategory",
  authenticate,
  authorize(["admin"]),
  category.create
);
router.get("/", authenticate, authorize(["admin","user"]), category.getCategories);
router.get("/:categoryID", authenticate, authorize(["admin"]), category.getCategory);
router.put("/:categoryID", authenticate,authorize(["admin"]), category.updateCategoryDetails);
router.delete("/:categoryID", authenticate, authorize(["admin"]), category.removeCategory);

export default router;
