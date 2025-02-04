import {
  TCreateProduct,
  TUpdateProduct,
} from "../validators/product.validator";
import { HTTP_STATUS_CODES } from "@/utils/http-status-codes";
import { uploadImage } from "@/utils/uploadImage";
import { AppError } from "@/types/error.type";
import prisma from "@/config/db.config";

const create = async ({
  branchId,
  productData,
  imageBuffer,
  mimetype,
}: {
  branchId: string;
  productData: TCreateProduct;
  imageBuffer?: Buffer;
  mimetype?: string;
}) => {
  return await prisma.$transaction(async (prisma) => {
    // Step 1: Create the product in the database with a placeholder imgURL.
    const createdProduct = await prisma.product.create({
      data: {
        ...productData,
        imgURL: "", // Placeholder; will update after successful upload.
      },
    });

    // Step 2: Create a stock entry for the product.
    await prisma.stock.create({
      data: {
        quantity: 0,
        branchId: branchId,
        productId: createdProduct.id,
      },
    });

    // Step 3: If an image is provided, upload it to Cloudinary.
    if (imageBuffer && mimetype) {
      try {
        const imageUrl = await uploadImage(imageBuffer, mimetype);

        // Step 4: Update the product with the uploaded image URL.
        await prisma.product.update({
          where: { id: createdProduct.id },
          data: { imgURL: imageUrl },
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new AppError(
            HTTP_STATUS_CODES.NOT_IMPLEMENTED,
            "Image upload failed",
          );
        }
      }
    }

    return createdProduct;
  });
};

const update = async ({
  id,
  productData,
  imageBuffer,
  mimetype,
}: {
  id: string;
  productData: TUpdateProduct;
  imageBuffer?: Buffer;
  mimetype?: string;
}) => {
  return await prisma.$transaction(async (prisma) => {
    let updatedProduct = null;
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new AppError(HTTP_STATUS_CODES.NOT_FOUND, "Product not found");
    }

    // Step 1: If an image is provided, upload it to Cloudinary.
    if (imageBuffer && mimetype) {
      try {
        const imageUrl = await uploadImage(imageBuffer, mimetype);

        // Step 2: Update the product with the uploaded image URL.
        updatedProduct = await prisma.product.update({
          where: { id },
          data: { ...productData, imgURL: imageUrl },
        });
      } catch (error: unknown) {
        if (error instanceof Error) {
          throw new AppError(
            HTTP_STATUS_CODES.NOT_IMPLEMENTED,
            "Image upload failed",
          );
        }
      }
    } else {
      // Step 3: Update the product with the new data.
      updatedProduct = await prisma.product.update({
        where: { id },
        data: productData,
      });
    }

    return updatedProduct;
  });
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
