import { authController } from "@modules/auth/controllers/auth.controller";
import { validate } from "@/middlewares/validate.middleware";
import { validateAuth } from "../validators/auth.validate";
import { asyncHandler } from "@handlers/async.handler";
import { Router } from "express";

const router = Router();
router.post(
  "/login",
  validate(validateAuth.login),
  asyncHandler(authController.login),
);

router.post(
  "/reset-password",
  validate(validateAuth.resetPassword),
  asyncHandler(authController.resetPassword),
);

router.post("/logout", asyncHandler(authController.logout));

router.post("/refresh", asyncHandler(authController.refreshTokens));

export const authRoutes = router;
