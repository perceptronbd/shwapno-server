import { stockController } from "../controllers/stock.controller";
import { validateStock } from "../validators/stock.validator";
import { validate } from "@/middlewares/validate.middleware";
import { asyncHandler } from "@/handlers/async.handler";
import { Router } from "express";

const router = Router();

// GET all stocks
router.get(
  "/",
  validate(validateStock.getAll),
  asyncHandler(stockController.getAll),
);

// GET stocks by branch
router.get(
  "/branch/:branchId",
  validate(validateStock.getByBranch),
  asyncHandler(stockController.getByBranch),
);

// GET stock by ID
router.get(
  "/:id",
  validate(validateStock.getById),
  asyncHandler(stockController.getById),
);

// POST create new stock
router.post(
  "/",
  validate(validateStock.create),
  asyncHandler(stockController.create),
);

// PATCH update stock quantity
router.patch(
  "/branch/:branchId",
  validate(validateStock.add),
  asyncHandler(stockController.add),
);

// DELETE stock
router.delete(
  "/:id",
  validate(validateStock.remove),
  asyncHandler(stockController.remove),
);

export const stockRoutes = router;
