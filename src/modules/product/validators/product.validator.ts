import { IMAGE_MIME, MAX_FILE_SIZE } from "../types/image.type";
import { z } from "zod";

const id = z.string({ invalid_type_error: "Invalid ID format" });
const branchId = z.string({ invalid_type_error: "Invalid ID format" });

const product = z.object({
  id,
  name: z.string().min(1, "Product name is required"),
  price: z.number().positive("Price must be a positive number"),
  barcode: z.string().min(1, "Barcode is required"),
  qrCode: z.string().optional(),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  branchId: id,
});

const imageFile = z.object({
  mimetype: z.enum(Object.values(IMAGE_MIME) as [string, ...string[]], {
    message: "Invalid image format",
  }),
  size: z
    .number()
    .max(
      MAX_FILE_SIZE,
      `Image size should not exceed ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    ),
});

// Validation for creating a product
const create = z.object({
  body: z.object({
    name: product.shape.name,
    price: product.shape.price,
    barcode: product.shape.barcode,
    description: product.shape.description,
    categoryId: product.shape.categoryId,
  }),
  file: imageFile.optional(),
});

// Validation for updating a product
const update = z.object({
  params: z.object({
    id,
  }),
  body: z.object({
    name: product.shape.name.optional(),
    price: product.shape.price.optional(),
    barcode: product.shape.barcode.optional(),
    description: product.shape.description.optional(),
  }),
  file: imageFile.optional(),
});

// Validation for deleting a product
const remove = z.object({
  params: z.object({
    id,
  }),
});

// Validation for fetching all products
const getAll = z.object({
  query: z.object({
    page: z
      .number()
      .int()
      .positive("Page must be a positive integer")
      .default(1), // Default to 1 if not provided
    limit: z
      .number()
      .int()
      .positive("Limit must be a positive integer")
      .default(10), // Default to 10 if not provided
  }),
});

// Validation for fetching a product by ID
const getById = z.object({
  params: z.object({
    id,
  }),
});

// Validation for fetching products by category
const getByCategory = z.object({
  query: z.object({
    category: z.string().min(1, "Category is required"),
  }),
  params: z.object({
    branchId: branchId, // Assuming branchId is defined
  }),
});

// Validation for fetching products by branch
const getByBranch = z.object({
  query: z.object({
    page: z
      .number()
      .int()
      .positive("Page must be a positive integer")
      .default(1), // Default to 1 if not provided
    limit: z
      .number()
      .int()
      .positive("Limit must be a positive integer")
      .default(10), // Default to 10 if not provided
  }),
  params: z.object({
    branchId: branchId, // Assuming branchId is defined
  }),
});

export type TProduct = z.infer<typeof product>;
export type TCreateProduct = z.infer<typeof create>["body"];
export type TUpdateProduct = z.infer<typeof update>["body"];
export type TRemoveProduct = z.infer<typeof remove>["params"];
export type TGetAllProducts = z.infer<typeof getAll>;
export type TGetProductById = z.infer<typeof getById>["params"];
export type TGetProductByCategory = z.infer<typeof getByCategory>["query"];
export type TGetProductByBranch = z.infer<typeof getByBranch>["query"];

export const validateProduct = {
  create,
  update,
  remove,
  getAll,
  getById,
  getByCategory,
  getByBranch,
};
