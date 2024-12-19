import express from "express";
import * as category from "../modules/item-category/controller.js";
import { authenticate } from "../core/middlewares/middleware.js";

const router = express.Router();

router.post("/addCategory", authenticate, category.create);
router.get("/", authenticate, category.getCategories);
router.get("/:categoryID", authenticate, category.getCategory);
router.put("/:categoryID", authenticate, category.updateCategoryDetails);
router.delete("/:categoryID", authenticate, category.removeCategory);

export default router;
