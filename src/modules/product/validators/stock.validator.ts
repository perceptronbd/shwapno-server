import { z } from "zod";

// ID schema for  validation
const id = z.string({ invalid_type_error: "Invalid ID format" });
const branchId = z.string({ invalid_type_error: "Invalid ID format" });

// Schema for productId
const productId = z.string({ invalid_type_error: "Invalid ID format" });
const quantity = z.number().positive().int().default(1);

// Validation for Create Stock
const create = z.object({
  body: z.object({
    quantity,
    productId,
    branchId: id,
  }),
});

// Validation for Update Stock
const add = z.object({
  body: z.object({
    quantity,
    productId,
  }),
  params: z.object({
    branchId,
  }),
});

// Validation for Delete Stock
const remove = z.object({
  params: z.object({
    id,
  }),
});

// Validation for Get All Stocks (company)
const getAll = z.object({
  params: z.object({
    id,
  }),
});

// Validation for Get Stock By Id
const getById = z.object({
  params: z.object({
    id,
  }),
});

// Validation for Get Stock By Branch
const getByBranch = z.object({
  params: z.object({
    branchId,
  }),
});

export type TCreateStock = z.infer<typeof create>["body"];
export type TUpdateStock = z.infer<typeof add>["body"];
export type TDeleteStock = z.infer<typeof remove>["params"];
export type TGetAllStocks = z.infer<typeof getAll>["params"];
export type TGetStockById = z.infer<typeof getById>["params"];
export type TGetStockByBranch = z.infer<typeof getByBranch>["params"];

// Exporting all schemas
export const validateStock = {
  create,
  add,
  remove,
  getAll,
  getById,
  getByBranch,
};
