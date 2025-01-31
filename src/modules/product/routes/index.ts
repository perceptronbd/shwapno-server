import { StockRoutes } from "./stock.route";
import { Router } from "express";

const route = Router();

route.use("/stock", StockRoutes);

export const ProductRoutes = route;
