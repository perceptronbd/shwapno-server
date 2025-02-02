import { orderController } from "../controllers/order.controller";
import { validate } from "@/middlewares/validate.middleware";
import { validateOrder } from "../validators/order.validate";
import { asyncHandler } from "@/handlers/async.handler";
import { Router } from "express";
const router = Router();

router.post(
  "/:id",
  validate(validateOrder.create),
  asyncHandler(orderController.create),
);
router.get(
  "/track/:id",
  validate(validateOrder.track),
  asyncHandler(orderController.track),
);

export const OrderRoutes = router;
