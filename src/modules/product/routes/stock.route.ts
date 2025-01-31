import { stockController } from "../controllers/stock.controller";
import { validateStock } from "../validators/stock.validator";
import { validate } from "@/middlewares/validate.middleware";
import { asyncHandler } from "@/handlers/async.handler";
import { Router } from "express";

const router = Router();

router.get(
  "/:id",
  validate(validateStock.getByBranch),
  asyncHandler(stockController.getByBranch),
);

export const StockRoutes = router;
