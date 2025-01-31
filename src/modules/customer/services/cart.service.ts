import {
  TAddCartRequest,
  TUpdateManyCartRequest,
} from "../validators/cart.validate";
import { HTTP_STATUS_CODES } from "@/utils/http-status-codes";
import { generateSessionId } from "@/utils/generate";
import { cartModel } from "../models/cart.model";
import { AppError } from "@/types/error.type";

const add = async ({ productId, quantity, sessionId }: TAddCartRequest) => {
  if (sessionId) {
    const cart = await cartModel.update({
      sessionId,
      productId,
      quantity,
    });
    return cart;
  }

  const genSessionId = generateSessionId();
  const cart = await cartModel.create({
    sessionId: genSessionId,
    productId,
    quantity,
  });

  return cart;
};

const update = async ({ items, sessionId }: TUpdateManyCartRequest) => {
  const cart = await cartModel.findBySessionId(sessionId, {
    customerId: true,
  });

  if (!cart) {
    throw new AppError(HTTP_STATUS_CODES.NOT_FOUND, "Cart not found");
  }

  const updatedCartItems = await cartModel.updateMany({
    items,
    cartId: cart?.id ?? "",
  });

  return {
    ...cart,
    items: updatedCartItems,
  };
};

const get = async (id: string) => {
  const cart = await cartModel.findOne(id);
  if (!cart) throw new Error("Cart not found");
  return cart;
};

export const cartService = {
  add,
  update,
  get,
};
