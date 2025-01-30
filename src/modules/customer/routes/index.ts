import { OrderRoutes } from "./order.route";
import { CartRoutes } from "./cart.route";
import { Router } from "express";
const router = Router();

router.use("/cart", CartRoutes);
router.use("/order", OrderRoutes);

export const CustomerRoutes = router;
