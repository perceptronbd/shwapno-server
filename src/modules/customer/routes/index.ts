import { productRoutes } from "./product.route";
import { branchRoute } from "./branch.route";
import { orderRoutes } from "./order.route";
import { cartRoutes } from "./cart.route";
import { Router } from "express";
const router = Router();

router.use("/cart", cartRoutes);
router.use("/order", orderRoutes);
router.use("/products", productRoutes);
router.use("/branch", branchRoute);

export const customerRoutes = router;
