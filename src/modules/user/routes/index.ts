import { userController } from "../controllers/user.controller";
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

export const UserRotes = router;
