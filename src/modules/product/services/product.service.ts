import {
  CloudinaryUploadResult,
  deleteImage,
  uploadImage,
} from "@/utils/cloudinary.util";
import {
  TCreateProduct,
  TUpdateProduct,
} from "../validators/product.validator";
import { productModel } from "../models/product.model";
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
    const createdProduct = await productModel.createProduct({
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

  // Fetch the existing product to check its current image details.
  const existingProduct = await prisma.product.findUnique({
    where: { id },
  });

  // If a new image file is provided, upload it.
  if (filePath && mimetype) {
    uploadResult = await uploadImage(filePath, mimetype, "product");

    // If there is an existing image, delete it.
    if (existingProduct?.imgPublicId) {
      await deleteImage(existingProduct.imgPublicId);
    }
  }

  // Build the update data. Start with the product data.
  const updateData: Partial<TUpdateProduct> & {
    imgURL?: string;
    imgPublicId?: string;
  } = {
    ...productData,
  };

  // Only update image fields if a new image was uploaded.
  if (uploadResult) {
    updateData.imgURL = uploadResult.secure_url;
    updateData.imgPublicId = uploadResult.public_id;
  }

  try {
    updatedProduct = await prisma.product.update({
      where: { id },
      data: updateData,
    });

    return updatedProduct;
  } catch (error: unknown) {
    // If the update fails and we just uploaded a new image, delete it.
    if (uploadResult?.public_id) {
      await deleteImage(uploadResult.public_id);
    }
    throw error;
  }
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
