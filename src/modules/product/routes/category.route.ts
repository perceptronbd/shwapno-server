import { categoryController } from "../controllers/category.controller";
import { validateCategory } from "../validators/category.validator";
import { validate } from "@/middlewares/validate.middleware";
import { asyncHandler } from "@/handlers/async.handler";
import { Router } from "express";

const router = Router();
router.post(
  "/",
  validate(validateCategory.create),
  asyncHandler(categoryController.create),
);

router.patch(
  "/:id",
  validate(validateCategory.update),
  asyncHandler(categoryController.update),
);

router.delete(
  "/:id",
  validate(validateCategory.remove),
  asyncHandler(categoryController.remove),
);

router.get(
  "/",
  validate(validateCategory.getAll),
  asyncHandler(categoryController.getAll),
);

router.get(
  "/:id",
  validate(validateCategory.getById),
  asyncHandler(categoryController.getById),
);

router.get(
  "/branch/:branchId",
  validate(validateCategory.getByBranch),
  asyncHandler(categoryController.getByBranch),
);

export const categoryRoutes = router;
