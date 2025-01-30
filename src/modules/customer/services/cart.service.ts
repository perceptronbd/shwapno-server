import { TAddCartRequest } from "../validators/cart.validate";
import { HTTP_STATUS_CODES } from "@/utils/http-status-codes";
import { generateSessionId } from "@/utils/generate";
import { cartModels } from "../models/cart.model";
import { AppError } from "@/types/error.type";

const add = async ({ productId, quantity }: TAddCartRequest) => {
  const sessionId = generateSessionId();

  const cart = await cartModels.create({
    sessionId,
    productId,
    quantity,
  });
  console.log("🚀 > add > cart:", cart);

  if (!cart) {
    throw new AppError(
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      "Failed to add product to cart",
    );
  }

  return cart;
};

const update = async (_data: { productId: string; quantity: number }[]) => {};

const get = async (id: string) => {
  return await cartModels.findAll(id);
};

export const cartService = {
  add,
  update,
  get,
};
