import { orderController } from "../controllers/order.controller";
import { asyncHandler } from "@/handlers/async.handler";
import { Router } from "express";
const router = Router();

router.post("/create", asyncHandler(orderController.create));

export const OrderRoutes = router;
