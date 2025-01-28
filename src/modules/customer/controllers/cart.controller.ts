import { HTTP_STATUS_CODES } from "@/utils/http-status-codes";
import { sendResponse } from "@/handlers/response.handler";
import { cartService } from "../services/cart.service";
import { Request, Response } from "express";

const add = async (req: Request, res: Response) => {
  const { productId, quantity } = req.body;

  const cart = await cartService.add({ productId, quantity });

  sendResponse(
    res,
    cart,
    HTTP_STATUS_CODES.CREATED,
    "Product added to cart successfully",
  );
};

const update = async (_req: Request, _res: Response) => {};

const get = async (_req: Request, _res: Response) => {};

export const cartController = {
  add,
  update,
  get,
};
