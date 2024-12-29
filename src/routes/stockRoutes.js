import express from "express";
import * as stockController from "../modules/stocks/controller.js";
import { authenticate } from "../core/middlewares/middleware.js";

const router = express.Router();

router.post("/addStock", authenticate, stockController.create);
router.get("/", authenticate, stockController.getStocks);
router.get("/:stockID", authenticate, stockController.getStock);
router.put("/:stockID", authenticate, stockController.updateStockDetails);
router.delete("/:stockID", authenticate, stockController.deleteStock);

export default router;
