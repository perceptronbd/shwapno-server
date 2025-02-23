import { validate } from "@/middlewares/validate.middleware";
import { QRcontroller } from "../controllers/qr.controller";
import { validateQR } from "../validators/qr.validator";
import { asyncHandler } from "@/handlers/async.handler";
import { Router } from "express";

const route = Router();

route.get("/", validate(validateQR.get), asyncHandler(QRcontroller.get));

export const companyRoute = route;
