import { HTTP_STATUS_CODES } from "@/utils/http-status-codes";
import { sendResponse } from "@/handlers/response.handler";
import { cartService } from "../services/cart.service";
import { Request, Response } from "express";

const add = async (req: Request, res: Response) => {
  const { productId, quantity, sessionId } = req.body;

  const cart = await cartService.add({ productId, quantity, sessionId });

  sendResponse(
    res,
    cart,
    HTTP_STATUS_CODES.CREATED,
    "Product added to cart successfully",
  );
};

const update = async (req: Request, res: Response) => {
  const cartData = await cartService.update({
    items: req.body?.items,
  });

  sendResponse(
    res,
    cartData,
    HTTP_STATUS_CODES.CREATED,
    "Product added to cart successfully",
  );
};

const get = async (req: Request, res: Response) => {
  const cartData = await cartService.get(req.params.id);

  sendResponse(
    res,
    cartData,
    HTTP_STATUS_CODES.OK,
    "Cart retrieved successfully",
  );
};

export const cartController = {
  add,
  update,
  get,
};
