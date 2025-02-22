import { userController } from "../controllers/user.controller";
import { authenticateJWT } from "@/middlewares/auth.middleware";
import { checkPolicy } from "@/middlewares/policy.middleware";
import { asyncHandler } from "@handlers/async.handler";
import { Action, Resource } from "@prisma/client";
import { Router } from "express";

const router = Router();

router.post(
  "/",
  checkPolicy("admin", Action.READ, Resource.ALL),
  asyncHandler(userController.createUser),
);

router.get(
  "/profile",
  authenticateJWT,
  asyncHandler(userController.getProfile),
);

export const userRotes = router;
