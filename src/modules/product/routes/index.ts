import { categoryRoutes } from "./category.route";
import { productsRoutes } from "./product.route";
import { stockRoutes } from "./stock.route";
import { Router } from "express";

const router = Router();

router.use("/stocks", stockRoutes);
router.use("/categories", categoryRoutes);
router.use("/", productsRoutes);

export const productRoutes = router;
