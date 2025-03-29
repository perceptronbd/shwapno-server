import { TGetProductByBranch } from "../validators/product.validate";
import prisma from "@/config/db.config";

const get = async ({ branchId, page, limit }: TGetProductByBranch) => {
  const skip = (page - 1) * limit;

  const result = await prisma.product.findMany({
    where: {
      stock: {
        some: {
          branchId,
          quantity: {
            gt: 0,
          },
        },
      },
    },
    skip,
    take: limit,
    select: {
      id: true,
      name: true,
      barcode: true,
      description: true,
      price: true,
      imgURL: true,
      category: { select: { name: true } },
    },
  });

  const transformedResult = result.map((product) => ({
    ...product,
    category: product.category ? product.category.name : null,
  }));

  return transformedResult;
};

export const productModel = {
  get,
};
