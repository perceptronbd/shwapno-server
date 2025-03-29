import {
  TGetAllOrder,
  TGetByBranchOrder,
  TUpdateStatusOrder,
} from "../validator/order.validate";
import { OrderStatus } from "@prisma/client";
import prisma from "@/config/db.config";

const getAll = async ({ userId, page, limit }: TGetAllOrder) => {
  const skip = (page - 1) * limit;
  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where: {
        branch: {
          companyId: {
            equals: userId,
          },
        },
      },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
        branch: true,
      },
      skip,
      take: limit,
      orderBy: {
        orderDate: "desc",
      },
    }),
    prisma.order.count({
      where: {
        branch: {
          companyId: {
            equals: userId,
          },
        },
      },
    }),
  ]);

  return { orders, total, page, limit };
};

const getByBranch = async ({ branchId, page, limit }: TGetByBranchOrder) => {
  const skip = (page - 1) * limit;
  const [orders, total] = await prisma.$transaction([
    prisma.order.findMany({
      where: { branchId },
      include: {
        customer: true,
        items: {
          include: {
            product: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        orderDate: "desc",
      },
    }),
    prisma.order.count({
      where: { branchId },
    }),
  ]);

  return { orders, total, page, limit };
};

const getById = async (id: string) => {
  return await prisma.order.findUnique({
    where: { id },
    include: {
      customer: true,
      items: {
        include: {
          product: true,
        },
      },
      branch: true,
      sale: true,
      invoice: true,
    },
  });
};

const updateStatus = async ({ id, status }: TUpdateStatusOrder) => {
  return await prisma.order.update({
    where: { id },
    data: { status },
    include: {
      customer: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });
};

const updateStatusWithStockDeduction = async (
  id: string,
  status: OrderStatus,
  branchId: string,
) => {
  return await prisma.$transaction(async (tx) => {
    // Get all order items with their products
    const orderItems = await tx.orderItem.findMany({
      where: { orderId: id },
      include: { product: true },
    });

    // For each item, deduct quantity from stock
    for (const item of orderItems) {
      const stock = await tx.stock.findFirst({
        where: {
          productId: item.productId,
          branchId: branchId,
        },
      });

      if (!stock) {
        throw new Error(`Stock not found for product ${item.product.name}`);
      }

      if (stock.quantity < item.quantity) {
        throw new Error(
          `Insufficient stock for ${item.product.name}. Available: ${stock.quantity}, Required: ${item.quantity}`,
        );
      }

      // Update stock by deducting ordered quantity
      await tx.stock.update({
        where: { id: stock.id },
        data: { quantity: { decrement: item.quantity } },
      });
    }

    // Update order status using transaction
    const updatedOrder = await tx.order.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        customer: true,
        branch: true,
      },
    });

    return updatedOrder;
  });
};

const remove = async (id: string) => {
  return await prisma.order.delete({
    where: { id },
  });
};

export const orderModel = {
  getAll,
  getByBranch,
  getById,
  updateStatus,
  updateStatusWithStockDeduction,
  remove,
};
