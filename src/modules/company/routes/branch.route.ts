import { branchController } from "../controllers/branch.controller";
import { validateBranch } from "../validators/branch.validator";
import { validate } from "@/middlewares/validate.middleware";
import { QRcontroller } from "../controllers/qr.controller";
import { validateQR } from "../validators/qr.validator";
import { asyncHandler } from "@/handlers/async.handler";
import { Router } from "express";

const router = Router();

router.get(
  "/:branchId",
  validate(validateBranch.getById),
  asyncHandler(branchController.getById),
);
router.post(
  "/:branchId",
  validate(validateQR.create),
  asyncHandler(QRcontroller.create),
);

export const branchRoutes = router;
