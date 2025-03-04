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

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) return;

    // If product doesn't exist in cart, add new item
    const newItem = await prisma.shoppingCartItem.create({
      data: {
        cartId: cart.id,
        productId,
        quantity,
        price: product.price, // Price will be fetched from product relation
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

const findAndUpdate = async ({ items, sessionId }: TUpdateManyCartRequest) => {
  return await prisma.$transaction(async (prisma) => {
    const cart = await prisma.shoppingCart.findUnique({
      where: {
        sessionId,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart)
      throw new AppError(HTTP_STATUS_CODES.NOT_FOUND, "Cart not found");

    // Update all items
    const updatedItems = await Promise.all(
      items.map((item) =>
        prisma.shoppingCartItem.update({
          where: {
            cartId_productId: {
              cartId: cart.id,
              productId: item.productId,
            },
          },
          data: {
            quantity: item.quantity,
          },
          include: {
            product: true,
          },
        }),
      ),
    );

    // Return the cart with updated items
    return {
      ...cart,
      items: updatedItems,
    };
  });
};

const deleteItem = ({
  sessionId,
  productId,
}: {
  sessionId: string;
  productId: string;
}) => {
  return prisma.shoppingCartItem.deleteMany({
    where: {
      cart: {
        sessionId,
      },
      productId,
    },
  });
};

export const cartModel = {
  create,
  update,
  findAndUpdate,
  findBySessionId,
  deleteItem,
};
