import prisma from "@/config/db.config";

const addStock = async ({
  branchId,
  productId,
  quantity,
}: {
  branchId: string;
  productId: string;
  quantity: number;
}) => {
  console.log(branchId, productId, quantity);

  const stock = await prisma.stock.findUnique({
    where: {
      branchId_productId: {
        branchId,
        productId,
      },
    },
  });

  if (!stock) {
    throw new Error("Stock not found");
  }

  const stockQuantity = stock?.quantity || 0;

  const addedStock = await prisma.stock.update({
    where: { id: stock.id },
    data: {
      quantity: stockQuantity + quantity,
    },
  });

  return addedStock;
};

const getAll = async () => {};

export const stockModel = {
  addStock,
  getAll,
};
