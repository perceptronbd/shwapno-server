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
  // Call the cart service to update the cart
  const updatedCart = await cartService.update({
    items: req.body?.items,
    sessionId: req.params?.id,
  });
  // Send a successful response with the updated cart data
  sendResponse(
    res,
    updatedCart,
    HTTP_STATUS_CODES.OK,
    "Cart updated successfully",
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

const deleteItem = async (req: Request, res: Response) => {
  const cartId = req.params.id;
  const productId = req.body.productId;
  await cartService.deleteItem({ cartId, productId });
  sendResponse(res, null, HTTP_STATUS_CODES.OK, "Item removed successfully!");
};

export const cartController = {
  add,
  update,
  get,
  deleteItem,
};
