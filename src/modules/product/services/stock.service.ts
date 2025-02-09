import { TCreateStock, TUpdateStock } from "../validators/stock.validator";
import { stockModel } from "../models/stock.model";
import prisma from "@/config/db.config";

const create = async (data: TCreateStock) => {
  const result = await prisma.stock.create({
    data,
  });
  return result;
};

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

const getAll = async () => {
  // const result = await prisma.stock.findMany({
  //   where: { branchId: id },
  // });

  return "result";
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
  });
  return result;
};

export const stockService = {
  create,
  add,
  remove,
  getAll,
  getById,
  getByBranch,
};
