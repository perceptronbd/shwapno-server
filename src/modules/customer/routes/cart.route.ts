import { cartController } from "../controllers/cart.controller";
import { validate } from "@/middlewares/validate.middleware";
import { validateCart } from "../validators/cart.validate";
import { asyncHandler } from "@/handlers/async.handler";
import { Router } from "express";
const router = Router();

router.post(
  "/add",
  validate(validateCart.add),
  asyncHandler(cartController.add),
);

export const CartRoutes = router;
