import express from "express";
import * as sales from "../modules/sales/controller.js";
import { authenticate } from "../core/middlewares/middleware.js";

const router = express.Router();

router.post("/addSale", authenticate, sales.create);
router.get("/", authenticate, sales.getSales);
router.get("/:saleID", authenticate, sales.getSale);
router.put("/:saleID", authenticate, sales.updateSaleDetails);
router.delete("/:saleID", authenticate, sales.deleteSaleDetails);

export default router;
