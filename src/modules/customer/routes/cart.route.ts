import { cartController } from "../controllers/cart.controller";
import { validate } from "@/middlewares/validate.middleware";
import { validateCart } from "../validators/cart.validate";
import { asyncHandler } from "@/handlers/async.handler";
import { Router } from "express";
const router = Router();

router.put(
  "/add",
  validate(validateCart.create),
  asyncHandler(cartController.add),
);
router.get("/:id", asyncHandler(cartController.get));

router.patch(
  "/update/:id",
  validate(validateCart.updateMany),
  asyncHandler(cartController.update),
);

export const CartRoutes = router;
