import {
  TAddCartRequest,
  TUpdateManyCartRequest,
  TUpdateOneCartRequest,
} from "../validators/cart.validate";
import { HTTP_STATUS_CODES } from "@/utils/http-status-codes";
import { AppError } from "@/types/error.type";
import prisma from "@/config/db.config";
import { Prisma } from "@prisma/client";

// Get  cart item
const findBySessionId = async (
  sessionId: string,
  omit?: Prisma.ShoppingCartFindUniqueArgs["omit"],
) => {
  const cart = await prisma.shoppingCart.findUnique({
    where: {
      sessionId,
    },
    omit,
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart) throw new AppError(HTTP_STATUS_CODES.NOT_FOUND, "Cart not found");
  if (!cart.items.length)
    throw new AppError(HTTP_STATUS_CODES.NOT_FOUND, "The cart is empty");
  return cart;
};

// Create a new cart
const create = async ({
  productId,
  quantity,
  sessionId,
}: Required<TAddCartRequest>) => {
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
      omit: {
        customerId: true,
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
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) return;

    // Step 2: Check if the product exists in the cart
    const existingItem = cart.items.find(
      (item) => item.productId === productId,
    );

    if (existingItem) {
      // Update existing item quantity
      const updatedItem = await prisma.shoppingCartItem.update({
        where: {
          id: existingItem.id,
        },
        data: {
          quantity: quantity,
        },
        include: {
          product: true,
        },
      });

      return {
        ...cart,
        items: [
          ...cart.items.filter((item) => item.id !== existingItem.id),
          updatedItem,
        ],
      };
    }

    // If product doesn't exist in cart, add new item
    const newItem = await prisma.shoppingCartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        price: 0, // Price will be fetched from product relation
      },
      include: {
        product: true,
      },
    });

    return {
      ...cart,
      items: [...cart.items, newItem],
    };
  });
};

const updateMany = async ({
  items,
  cartId,
}: Omit<TUpdateManyCartRequest, "sessionId"> & { cartId: string }) => {
  return items.map(
    async (item) =>
      await prisma.shoppingCartItem.update({
        where: {
          cartId_productId: {
            cartId,
            productId: item.productId,
          },
        },
        data: {
          quantity: item.quantity, // Update the quantity for the specific product
        },
        include: {
          product: true,
        },
      }),
  );
};
export const cartModel = {
  create,
  update,
  updateMany,
  findBySessionId,
};
