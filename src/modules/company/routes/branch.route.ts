import { branchController } from "../controllers/branch.controller";
import { validateBranch } from "../validators/branch.validator";
import { validate } from "@/middlewares/validate.middleware";
import { QRcontroller } from "../controllers/qr.controller";
import { validateQR } from "../validators/qr.validator";
import { asyncHandler } from "@/handlers/async.handler";
import { Router } from "express";

const router = Router();

router.get(
  "/:name",
  validate(validateBranch.getByName),
  asyncHandler(branchController.getByName),
);
router.get("/", validate(validateQR.get), asyncHandler(QRcontroller.get));

export const branchRoutes = router;
