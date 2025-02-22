import { productRoutes } from "./product.route";
import { orderRoutes } from "./order.route";
import { cartRoutes } from "./cart.route";
import { Router } from "express";
const router = Router();

router.use("/cart", cartRoutes);
router.use("/order", orderRoutes);
router.use("/products", productRoutes);

export const customerRoutes = router;
