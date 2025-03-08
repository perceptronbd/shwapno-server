import {
  TCreateProduct,
  TGetProductByBranch,
} from "../validators/product.validator";
import { CloudinaryUploadResult } from "@/utils/cloudinary.util";
import prisma from "@/config/db.config";

const createProduct = async ({
  data,
  branchId,
  imgUploadResult,
}: {
  data: TCreateProduct;
  branchId: string;
  imgUploadResult: CloudinaryUploadResult | null;
}) => {
  const { categoryId, ...product } = data;
  const quantity = data.quantity ?? 0;

  return prisma.$transaction(async (prisma) => {
    const createdProduct = await prisma.product.create({
      data: {
        ...product,
        category: { connect: { id: categoryId } },
        imgURL: imgUploadResult?.secure_url ?? null,
        imgPublicId: imgUploadResult?.public_id ?? null,
      },
    });

    await prisma.stock.create({
      data: {
        quantity: quantity,
        branchId: branchId,
        productId: createdProduct.id,
      },
    });

    return createdProduct;
  });
};

const getProducts = async ({ branchId, page, limit }: TGetProductByBranch) => {
  const skip = (page - 1) * limit;

  const result = await prisma.product.findMany({
    where: {
      stock: {
        some: {
          branchId,
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

const deleteProduct = async ({ id }: { id: string }) => {
  return await prisma.$transaction(async (prisma) => {
    await prisma.shoppingCartItem.deleteMany({
      where: {
        productId: id,
      },
    });
    await prisma.orderItem.deleteMany({
      where: {
        productId: id,
      },
    });
    await prisma.stock.deleteMany({
      where: {
        productId: id,
      },
    });
    return await prisma.product.delete({
      where: { id },
    });
  });
};

export const productModel = {
  createProduct,
  getProducts,
  deleteProduct,
};
