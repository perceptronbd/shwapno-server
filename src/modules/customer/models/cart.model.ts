import { HTTP_STATUS_CODES } from "@/utils/http-status-codes";
import { ICartCreatePayload } from "../types/cart";
import { AppError } from "@/types/error.type";
import prisma from "@/config/db.config";

// Get all cart items
const findAll = async (cartId: string) => {
  return await prisma.shoppingCartItem.findMany({
    where: {
      cartId,
    },
    include: {
      product: true,
    },
  });
};

// Create a new cart
const create = async ({
  productId,
  quantity,
  sessionId,
}: ICartCreatePayload) => {
  return await prisma.$transaction(async (prisma) => {
    // Step 1 : Check if the product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new AppError(HTTP_STATUS_CODES.NOT_FOUND, "Product not found");
    }

    // Step 2: Create the shopping cart
    const cart = await prisma.shoppingCart.create({
      data: {
        sessionId,
      },
      select: {
        id: true,
        sessionId: true,
      },
    });
    // Step 3: Add the item to the shopping cart
    await prisma.shoppingCartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        price: product.price,
      },
      include: {
        product: true,
      },
    });

    // Return the created cart
    return { ...cart };
  });
};

export const cartModels = {
  findAll,
  create,
};
