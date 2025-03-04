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
  const cart = await cartModel.findAndUpdate({
    items,
    sessionId,
  });

  return cart;
};

const get = async (id: string) => {
  const cart = await cartModel.findBySessionId(id);
  if (!cart) throw new AppError(HTTP_STATUS_CODES.NOT_FOUND, "Cart not found");
  return cart;
};

const deleteItem = async ({
  cartId,
  productId,
}: {
  cartId: string;
  productId: string;
}) => {
  return await cartModel.deleteItem({
    cartId,
    productId,
  });
};

export const cartService = {
  add,
  update,
  get,
  deleteItem,
};
