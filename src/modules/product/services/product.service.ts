import {
  TCreateProduct,
  TGetProductByBranch,
  TUpdateProduct,
} from "../validators/product.validator";
import {
  CloudinaryUploadResult,
  deleteImage,
  uploadImage,
} from "@/utils/cloudinary.util";
import { productModel } from "../models/product.model";
import { TMeta } from "@/handlers/response.handler";
import prisma from "@/config/db.config";

const create = async ({
  branchId,
  productData,
  filePath,
  mimetype,
}: {
  branchId: string;
  productData: TCreateProduct;
  filePath?: string;
  mimetype?: string;
}) => {
  let uploadResult: CloudinaryUploadResult | null = null;

  if (filePath && mimetype) {
    console.log("attempting to upload image...");
    uploadResult = await uploadImage(filePath, mimetype, "product");
  }

  try {
    const createdProduct = await productModel.create({
      data: productData,
      branchId,
      imgUploadResult: uploadResult,
    });

    return createdProduct;
  } catch (error: unknown) {
    if (uploadResult?.public_id) {
      await deleteImage(uploadResult.public_id);
    }
    throw error;
  }
};

const update = async ({
  id,
  productData,
  filePath,
  mimetype,
}: {
  id: string;
  productData: TUpdateProduct;
  filePath?: string;
  mimetype?: string;
}) => {
  let updatedProduct = null;
  let uploadResult: CloudinaryUploadResult | null = null;
  const existingProduct = await prisma.product.findUnique({ where: { id } });

  if (filePath && mimetype) {
    uploadResult = await uploadImage(filePath, mimetype, "product");
    if (existingProduct?.imgPublicId) {
      await deleteImage(existingProduct.imgPublicId);
    }
  }

  try {
    // check for category change
    const categoryName = productData.category?.trim() as string;

    const isCategoryExists = await prisma.category.findUnique({
      where: {
        name: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
      },
    });

    if (!isCategoryExists) {
      await prisma.category.create({
        data: {
          name: categoryName.charAt(0).toUpperCase() + categoryName.slice(1),
        },
      });
    }

    updatedProduct = await productModel.update(id, {
      ...productData,
      ...(uploadResult && {
        imgURL: uploadResult.secure_url,
        imgPublicId: uploadResult.public_id,
      }),
    });

    console.log(updatedProduct);

    return updatedProduct;
  } catch (error: unknown) {
    if (uploadResult?.public_id) await deleteImage(uploadResult.public_id);
    throw error;
  }
};

const remove = async ({ id }: { id: string }) => {
  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });
  const result = await productModel.remove({ id });

  if (existingProduct?.imgPublicId && result) {
    await deleteImage(existingProduct.imgPublicId);
  }

  return result;
};

const getAll = async (query?: Record<string, unknown>) => {
  const limit = query?.limit ? Number(query.limit) : 20;
  const page = query?.page ? Number(query.page) : 1;

  const result = await prisma.product.findMany({
    include: {
      category: true,
    },
    skip: (page - 1) * limit,
    take: limit,
  });

  const total = await prisma.stock.count({});

  const totalPage = Math.ceil(total / limit);

  const meta: TMeta = {
    page: page,
    limit: limit,
    totalPage: totalPage,
    totalData: total,
  };

  return {
    data: result,
    meta,
  };
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

const getByBranch = async ({ branchId, page, limit }: TGetProductByBranch) => {
  const result = await productModel.get({ branchId, page, limit });

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
