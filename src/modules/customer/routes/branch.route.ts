import { branchController } from "../controllers/branch.controller";
import { validateBranch } from "../validators/branch.validator";
import { validate } from "@/middlewares/validate.middleware";
import { asyncHandler } from "@/handlers/async.handler";
import { Router } from "express";

const router = Router();
router.get(
  "/:name",
  validate(validateBranch.getByName),
  asyncHandler(branchController.getByName),
);

export const branchRoute = router;
