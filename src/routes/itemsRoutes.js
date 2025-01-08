import express from "express";
import * as item from "../modules/items/controller.js";
import { authenticate } from "../core/middlewares/middleware.js";

import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post("/addItem", authenticate, upload.array("itemImages"), item.create);
router.get("/", authenticate, item.getItems);
router.get("/:itemID", authenticate, item.getItem);
router.put(
  "/:itemID",
  authenticate,
  upload.array("itemImages"),
  item.updateItemDetails
);
router.delete("/:itemID", authenticate, item.deleteItemDetails);

export default router;
