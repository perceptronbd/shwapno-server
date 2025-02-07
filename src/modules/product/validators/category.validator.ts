import { z } from "zod";

// Base schema for the category name
const categoryName = z.string().min(1, "Category name is required");

// ID schema for  validation
const id = z.string({ invalid_type_error: "Invalid ID format" });

// Schema for branchId
const branchId = z.string({ invalid_type_error: "Invalid ID format" });

// Create category validation
const create = z.object({
  body: z.object({
    name: categoryName,
  }),
});

// Update category validation
const update = z.object({
  body: z.object({
    name: categoryName,
  }),
  params: z.object({
    id: id,
  }),
});

// Delete category validation
const remove = z.object({
  params: z.object({
    id: id,
  }),
});

// Get all categories validation
const getAll = z.object({
  query: z
    .object({
      page: z
        .string()
        .optional()
        .refine((value) => {
          if (value === undefined) {
            return true; // Page is optional, so return true if it's undefined
          }
          return /^\d+$/.test(value); // Validate the format of the page value
        }, "Page must be a valid number"),
    })
    .optional(),
});

// Get category by ID validation
const getById = z.object({
  params: z.object({
    id: id,
  }),
});

// Get categories by branch validation
const getByBranch = z.object({
  query: z.object({
    branchId: branchId,
  }),
});

export type TCreateCategory = z.infer<typeof create>["body"];
export type TUpdateCategory = z.infer<typeof update>["body"];
export type TRemoveCategory = z.infer<typeof remove>["params"];
export type TFindManyCategory = z.infer<typeof getAll>["query"];
export type TFindUniqueCategory = z.infer<typeof getById>["params"];
export type TGetByBranchCategory = z.infer<typeof getByBranch>["query"];

export const validateCategory = {
  create,
  update,
  remove,
  getAll,
  getById,
  getByBranch,
};
