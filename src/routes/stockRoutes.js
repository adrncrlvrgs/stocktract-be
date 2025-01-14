import express from "express";
import * as stockController from "../modules/stocks/controller.js";
import { authenticate, authorize } from "../core/middlewares/middleware.js";

const router = express.Router();

router.post("/addStock", authenticate,  authorize(["admin"]), stockController.create);
router.get("/", authenticate,  authorize(["admin", "user"]), stockController.getStocks);
router.get("/:stockID", authenticate, authorize(["admin", "user"]), stockController.getStock);
router.put("/:stockID", authenticate, authorize(["admin"]), stockController.updateStockDetails);
router.delete("/:stockID", authenticate, authorize(["admin"]), stockController.removeStock);

export default router;
