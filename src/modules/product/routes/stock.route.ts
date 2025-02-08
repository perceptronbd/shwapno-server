import { stockController } from "../controllers/stock.controller";
import { validateStock } from "../validators/stock.validator";
import { validate } from "@/middlewares/validate.middleware";
import { asyncHandler } from "@/handlers/async.handler";
import { Router } from "express";

const router = Router();

router.post(
  "/",
  validate(validateStock.create),
  asyncHandler(stockController.create),
);

router.patch(
  "/:branchId",
  validate(validateStock.update),
  asyncHandler(stockController.update),
);

router.delete(
  "/:id",
  validate(validateStock.remove),
  asyncHandler(stockController.remove),
);

router.get(
  "/",
  validate(validateStock.getAll),
  asyncHandler(stockController.getAll),
);

router.get(
  "/:id",
  validate(validateStock.getById),
  asyncHandler(stockController.getById),
);

router.get(
  "/:branchId",
  validate(validateStock.getByBranch),
  asyncHandler(stockController.getByBranch),
);

export const StockRoutes = router;
