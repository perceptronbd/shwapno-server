import { TCreateStock, TUpdateStock } from "../validators/stock.validator";
import prisma from "@/config/db.config";

const create = async (data: TCreateStock) => {
  const result = await prisma.stock.create({
    data,
  });
  return result;
};

const update = async ({
  branchId,
  data,
}: {
  branchId: string;
  data: TUpdateStock;
}) => {
  const stock = await prisma.stock.findUnique({
    where: { id: branchId },
  });

  const result = await prisma.stock.update({
    where: { id: stock?.id },
    data,
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
    omit: { lowStockAlert: true },
  });
  return result;
};

export const stockService = {
  create,
  update,
  remove,
  getAll,
  getById,
  getByBranch,
};
