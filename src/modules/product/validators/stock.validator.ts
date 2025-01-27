import { z } from "zod";

// ID schema for  validation
const id = z.string({ invalid_type_error: "Invalid ID format" });

// Schema for productId
const productId = z.string({ invalid_type_error: "Invalid ID format" });
const quantity = z.number().positive().int().default(1);

// Validation for Create Stock
const createStockSchema = z.object({
  body: z.object({
    quantity,
    productId,
  }),
});

// Validation for Update Stock
const updateStockSchema = z.object({
  body: z.object({
    quantity,
    productId,
  }),
  params: z.object({
    id,
  }),
});

// Validation for Delete Stock
const deleteStockSchema = z.object({
  params: z.object({
    id,
  }),
});

// Validation for Get All Stocks (company)
const getAllStocksSchema = z.object({
  params: z.object({
    id,
  }),
});

// Validation for Get Stock By Id
const getStockByIdSchema = z.object({
  params: z.object({
    id,
  }),
});

// Validation for Get Stock By Branch
const getStockByBranchSchema = z.object({
  params: z.object({
    id,
  }),
});

// Exporting all schemas
export const validateStock = {
  create: createStockSchema,
  update: updateStockSchema,
  remove: deleteStockSchema,
  getAll: getAllStocksSchema,
  getById: getStockByIdSchema,
  getByBranch: getStockByBranchSchema,
};
