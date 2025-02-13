import { productController } from "../controllers/product.controller";
import { validateProduct } from "../validators/product.validator";
import { validate } from "@/middlewares/validate.middleware";
import { asyncHandler } from "@/handlers/async.handler";
import { upload } from "@/config/cloudinary.config";
import { Router } from "express";

const router = Router();

router.post(
  "/:branchId",
  upload.single("image"),
  validate(validateProduct.create),
  asyncHandler(productController.create),
);

router.patch(
  "/:id",
  upload.single("image"),
  validate(validateProduct.update),
  asyncHandler(productController.update),
);

router.delete(
  "/:id",
  validate(validateProduct.remove),
  asyncHandler(productController.remove),
);

router.get(
  "/",
  validate(validateProduct.getAll),
  asyncHandler(productController.getAll),
);

router.get(
  "/:id",
  validate(validateProduct.getById),
  asyncHandler(productController.getById),
);

router.get(
  "/category/:id",
  validate(validateProduct.getByCategory),
  asyncHandler(productController.getByCategory),
);

router.get(
  "/branch/:id",
  validate(validateProduct.getByBranch),
  asyncHandler(productController.getByBranch),
);

export const ProductRoutes = router;
