import { TUpdateOneCartRequest } from "../validators/cart.validate";
import { HTTP_STATUS_CODES } from "@/utils/http-status-codes";
import { ICartCreatePayload } from "../types/cart";
import { AppError } from "@/types/error.type";
import prisma from "@/config/db.config";

// Get  cart items
const findOne = async (id: string) => {
  return await prisma.shoppingCart.findUnique({
    where: {
      id,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
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
    const items = await prisma.shoppingCartItem.create({
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
    return { ...cart, items: [items] };
  });
};

const update = async ({
  sessionId,
  productId,
  quantity,
}: TUpdateOneCartRequest) => {
  return await prisma.$transaction(async (prisma) => {
    // Step 1: Check if the cart exists for the given `sessionId`.
    const cart = await prisma.shoppingCart.findUnique({
      where: { sessionId },
    });

    if (!cart) return;

    // Step 2: Check if the product exists in the cart
    const cartItem = await prisma.shoppingCartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
      },
    });

    if (!cartItem) {
      return;
    }

    // Step 3: If the product exists, update its quantity

    // If quantity is 0 or less, remove the item from the cart
    if (quantity <= 0) {
      await prisma.shoppingCartItem.delete({
        where: {
          id: cartItem.id,
        },
      });
    } else {
      // Otherwise, update the quantity
      const items = await prisma.shoppingCartItem.update({
        where: {
          id: cartItem.id,
        },
        data: {
          quantity,
        },
        include: {
          product: true,
        },
      });

      // Step 4: Return the updated cart
      return {
        ...cart,
        items: [items],
      };
    }
  });
};

export const cartModel = {
  findOne,
  create,
  update,
};
