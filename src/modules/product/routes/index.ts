import { CategoryRoutes } from "./category.route";
import { ProductRoutes } from "./product.route";
import { StockRoutes } from "./stock.route";
import { Router } from "express";

const router = Router();

router.use("/", ProductRoutes);
router.use("/stock", StockRoutes);
router.use("/category", CategoryRoutes);

export const Product = router;
