import { CategoryRoutes } from "./category.route";
import { ProductRoutes } from "./product.route";
import { StockRoutes } from "./stock.route";
import { Router } from "express";

const router = Router();

router.use("/stocks", StockRoutes);
router.use("/categories", CategoryRoutes);
router.use("/", ProductRoutes);

export const Product = router;
