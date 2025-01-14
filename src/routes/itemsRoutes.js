import express from "express";
import * as item from "../modules/items/controller.js";
import { authenticate, authorize } from "../core/middlewares/middleware.js";

import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post(
  "/addItem",
  authenticate,
  authorize(["admin", "user"]),
  upload.array("itemImages"),
  item.create
);
router.get("/", authenticate, authorize(["admin", "user"]), item.getItems);
router.get(
  "/:itemID",
  authenticate,
  authorize(["admin", "user"]),
  item.getItem
);
router.put(
  "/:itemID",
  authenticate,
  authorize(["admin", "user"]),
  upload.array("itemImages"),
  item.updateItemDetails
);
router.delete(
  "/:itemID",
  authenticate,
  authorize(["admin", "user"]),
  item.deleteItemDetails
);

export default router;
