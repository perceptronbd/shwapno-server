import { productController } from "@/modules/product/controllers/product.controller";
import { validateProduct } from "../validators/product.validate";
import { validate } from "@/middlewares/validate.middleware";
import { asyncHandler } from "@/handlers/async.handler";
import { Router } from "express";

const route = Router();

route.get(
  "/branch/:branchId",
  validate(validateProduct.getByBranch),
  asyncHandler(productController.getByBranch),
);

export const productRoutes = route;
