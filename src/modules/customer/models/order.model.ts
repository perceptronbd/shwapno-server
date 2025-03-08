import { Decimal } from "@prisma/client/runtime/library";
import { TOrderPayload } from "../types/order";
import { cartModel } from "./cart.model";
import prisma from "@/config/db.config";

const create = async ({ customer, sessionId, branchId }: TOrderPayload) => {
  return await prisma.$transaction(async (trx) => {
    // Check if customer exists
    let customerData = await trx.customer.findFirst({
      where: {
        AND: [{ email: customer.email }, { mobile: customer.mobile }],
      },
    });

    // If customer doesn't exist, create new customer
    if (!customerData) {
      customerData = await trx.customer.create({
        data: {
          ...customer,
        },
      });
    }

    // get the cartItems by sessionId
    const cartItems = await cartModel.findBySessionId(sessionId);

    const totalAmount = cartItems.items.reduce((total, item) => {
      const price = new Decimal(item.price);
      return total.add(price.mul(item.quantity));
    }, new Decimal(0));

    const order = await trx.order.create({
      data: {
        customerId: customerData.id,
        branchId,
        orderDate: new Date(),
        totalAmount: totalAmount,
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const orderItems = await trx.orderItem.createManyAndReturn({
      data: cartItems.items.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      include: {
        product: true,
      },
    });

    await trx.shoppingCartItem.deleteMany({
      where: {
        cartId: cartItems.id,
      },
    });

    return { ...order, items: orderItems };
  });
};

const update = async () => {};

const find = async (customerId: string) => {
  const order = await prisma.order.findMany({
    where: {
      customerId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      orderDate: "desc",
    },
  });
  return order;
};

export const orderModel = {
  create,
  find,
  update,
};
