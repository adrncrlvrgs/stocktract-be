import express from "express";
import * as sales from "../modules/sales/controller.js";
import { authenticate, authorize } from "../core/middlewares/middleware.js";

const router = express.Router();

router.post(
  "/addSale",
  authenticate,
  authorize(["admin", "user"]),
  sales.create
);
router.get("/", authenticate, authorize(["admin", "user"]), sales.getSales);
router.get(
  "/:saleID",
  authenticate,
  authorize(["admin", "user"]),
  sales.getSale
);
router.put(
  "/:saleID",
  authenticate,
  authorize(["admin", "user"]),
  sales.updateSaleDetails
);
router.delete(
  "/:saleID",
  authenticate,
  authorize(["admin", "user"]),
  sales.deleteSaleDetails
);

export default router;
