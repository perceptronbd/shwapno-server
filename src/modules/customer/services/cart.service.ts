import {
  TAddCartRequest,
  TUpdateManyCartRequest,
} from "../validators/cart.validate";
import { generateSessionId } from "@/utils/generate";
import { cartModel } from "../models/cart.model";

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

const update = async ({ items }: TUpdateManyCartRequest) => {
  console.log(items);
};

const get = async (id: string) => {
  return await cartModel.findOne(id);
};

export const cartService = {
  add,
  update,
  get,
};
