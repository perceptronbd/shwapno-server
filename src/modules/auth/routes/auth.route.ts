import { authController } from "@modules/auth/controllers/auth.controller";
import { asyncHandler } from "@handlers/async.handler";
import { Router } from "express";

const router = Router();

router.post("/refresh", asyncHandler(authController.refreshTokens));

export const AuthRoutes = router;
