import {
  TGetAllOrder,
  TGetByBranchOrder,
  TUpdateStatusOrder,
} from "../validator/order.validate";
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
  remove,
};
