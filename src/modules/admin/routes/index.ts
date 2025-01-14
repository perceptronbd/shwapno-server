import { adminController } from "@modules/admin/controllers/admin.controller";
import { AdminValidate } from "@modules/admin/validators/admin.validator";
import { authenticateJWT } from "@middlewares/auth.middleware";
import { validate } from "@middlewares/validate.middleware";
import { asyncHandler } from "@handlers/async.handler";
import { Router } from "express";

const router = Router();

router.post(
  "/login",
  validate(AdminValidate.login),
  asyncHandler(adminController.login),
);

router.post(
  "/register",
  validate(AdminValidate.create),
  // authenticateJWT,
  asyncHandler(adminController.create),
);

router.post("/logout", authenticateJWT, asyncHandler(adminController.logout));

export const AdminRoutes = router;
