import { TCreateProduct } from "../validators/product.validator";
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

export const productModel = {
  createProduct,
};
