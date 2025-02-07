import {
  TCreateProduct,
  TUpdateProduct,
} from "../validators/product.validator";
import prisma from "@/config/db.config";

const create = async ({
  branchId,
  product: data,
}: {
  branchId: string;
  product: TCreateProduct;
}) => {
  return await prisma.$transaction(async (prisma) => {
    const createdProduct = await prisma.product.create({
      data,
    });

    await prisma.stock.create({
      data: {
        quantity: 0,
        branchId: branchId,
        productId: createdProduct.id,
      },
    });

    return createdProduct;
  });
};

const update = async ({
  id,
  productData,
}: {
  id: string;
  productData: TUpdateProduct;
}) => {
  const updatedProduct = await prisma.product.update({
    where: { id },
    data: productData,
  });
  return updatedProduct;
};

const remove = async ({ id }: { id: string }) => {
  return await prisma.product.delete({
    where: { id },
  });
};

const getAll = async () => {
  const result = await prisma.product.findMany();
  return result;
};

const getById = async (id: string) => {
  const result = await prisma.product.findUnique({
    where: { id },
  });
  return result;
};

const getByCategory = async ({
  branchId: _,
  category,
}: {
  branchId: string;
  category: string;
}) => {
  const result = await prisma.product.findMany({
    where: {
      category: {
        name: category,
      },
    },
  });

  return result;
};

const getByBranch = async ({
  branchId,
  page = 1,
}: {
  branchId: string;
  page: number;
  limit: number;
}) => {
  const result = await prisma.product.findMany({
    where: {
      stock: {
        some: {
          branchId, // Use `branchId` as part of the `some` filter
        },
      },
    },
    take: 10, // Pagination limit
    skip: 10 * (page - 1), // Skip based on the page number
    select: {
      name: true,
      price: true,
      imgURL: true,
      category: { select: { name: true } },
    },
  });

  return result;
};

export const productService = {
  create,
  update,
  remove,
  getAll,
  getById,
  getByCategory,
  getByBranch,
};
