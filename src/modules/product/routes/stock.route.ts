import { stockController } from "../controllers/stock.controller";
import { validateStock } from "../validators/stock.validator";
import { validate } from "@/middlewares/validate.middleware";
import { asyncHandler } from "@/handlers/async.handler";
import { upload } from "@/config/cloudinary.config";
import { Router } from "express";

const router = Router();

// GET all stocks
router.get(
  "/",
  validate(validateStock.getAll),
  asyncHandler(stockController.getAll),
);

// GET upload status
router.get("/status/:jobId", asyncHandler(stockController.getUploadStatus));

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
// stock.routes.ts - Add upload endpoint
router.post(
  "/upload/branch/:branchId",
  upload.single("file"),
  validate(validateStock.uploadExcel),
  asyncHandler(stockController.uploadExcel),
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
