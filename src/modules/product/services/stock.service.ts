import { TUpdateStock } from "../validators/stock.validator";
import { stockModel } from "../models/stock.model";
import prisma from "@/config/db.config";

const add = async ({
  branchId,
  data,
}: {
  branchId: string;
  data: TUpdateStock;
}) => {
  const result = await stockModel.addStock({
    branchId,
    productId: data.productId,
    quantity: data.quantity,
  });

  return result;
};

const remove = async ({ id }: { id: string }) => {
  const result = await prisma.stock.delete({
    where: { id },
  });
  return result;
};

const getAll = async ({
  id,
  page,
  limit,
}: {
  id: string;
  page: number;
  limit: number;
}) => {
  const result = await stockModel.getAll({ id, page, limit });

  return result;
};

const getById = async ({ id }: { id: string }) => {
  const result = await prisma.stock.findUnique({
    where: { id },
  });
  return result;
};

const getByBranch = async ({ branchId }: { branchId: string }) => {
  const result = await prisma.stock.findMany({
    where: { branchId },
    include: {
      product: true,
    },
  });
  return result;
};

export const stockService = {
  add,
  remove,
  getAll,
  getById,
  getByBranch,
};
