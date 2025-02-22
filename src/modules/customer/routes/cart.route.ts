import { cartController } from "../controllers/cart.controller";
import { validate } from "@/middlewares/validate.middleware";
import { validateCart } from "../validators/cart.validate";
import { asyncHandler } from "@/handlers/async.handler";
import { Router } from "express";
const router = Router();

router.put(
  "/",
  validate(validateCart.create),
  asyncHandler(cartController.add),
);

router.get(
  "/:id",
  validate(validateCart.get),
  asyncHandler(cartController.get),
);

router.delete(
  "/:id",
  validate(validateCart.remove),
  asyncHandler(cartController.get),
);

router.patch(
  "/:id",
  validate(validateCart.updateMany),
  asyncHandler(cartController.update),
);

export const cartRoutes = router;
