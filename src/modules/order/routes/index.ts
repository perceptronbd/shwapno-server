import { orderController } from "../controllers/order.controller";
import { authenticateJWT } from "@/middlewares/auth.middleware";
import { checkPolicy } from "@/middlewares/policy.middleware";
import { validate } from "@/middlewares/validate.middleware";
import { validateOrder } from "../validator/order.validate";
import { asyncHandler } from "@/handlers/async.handler";
import { Action, Resource } from "@prisma/client";
import { Router } from "express";

const router = Router();

router.get(
  "/",
  authenticateJWT,
  checkPolicy("admin", Action.READ, Resource.ALL),
  validate(validateOrder.getAll),
  asyncHandler(orderController.getAll),
);

router.get(
  "/branch/:branchId",
  authenticateJWT,
  checkPolicy("admin", Action.READ, Resource.ORDER),
  validate(validateOrder.getByBranch),
  asyncHandler(orderController.getByBranch),
);

router.get(
  "/:id",
  authenticateJWT,
  checkPolicy("admin", Action.READ, Resource.ORDER),
  validate(validateOrder.getById),
  asyncHandler(orderController.getById),
);

router.patch(
  "/:id/status",
  authenticateJWT,
  checkPolicy("admin", Action.WRITE, Resource.ORDER),
  validate(validateOrder.updateStatus),
  asyncHandler(orderController.updateStatus),
);

router.delete(
  "/:id",
  authenticateJWT,
  checkPolicy("admin", Action.WRITE, Resource.ORDER),
  validate(validateOrder.remove),
  asyncHandler(orderController.remove),
);

export const ordersRoutes = router;
