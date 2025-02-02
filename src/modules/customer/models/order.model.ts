import { Decimal } from "@prisma/client/runtime/library";
import { TOrderPayload } from "../types/order";
import { cartModel } from "./cart.model";
import prisma from "@/config/db.config";
const create = async ({ customer, sessionId, branchId }: TOrderPayload) => {
  return await prisma.$transaction(async (trx) => {
    // Create customer and get the customer ID
    const customerData = await trx.customer.create({
      data: {
        ...customer,
      },
    });

    // get the cartItems by sessionId
    const cartItems = await cartModel.findBySessionId(sessionId);
    //create order with customerId, branchId and cartItems
    const totalAmount = cartItems.items.reduce((total, item) => {
      // convert to decimal
      const price = new Decimal(item.price);
      // add the price to the total
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
    // create orderItems
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
    // delete cartItems
    await trx.shoppingCartItem.deleteMany({
      where: {
        cartId: cartItems.id,
      },
    });

    return { ...order, items: orderItems };
  });
};

const update = async () => {};

const findOne = async () => {};

export const orderModel = {
  create,
  findOne,
  update,
};
