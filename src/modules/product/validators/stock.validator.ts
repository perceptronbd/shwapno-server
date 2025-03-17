import { z } from "zod";

// ID schema for  validation
const id = z.string({ invalid_type_error: "Invalid ID format" });
const branchId = z.string({ invalid_type_error: "Invalid ID format" });

// Schema for productId
const productId = z.string({ invalid_type_error: "Invalid ID format" });
const quantity = z.number().positive().int().default(1);

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

export const excelRowSchema = z.object({
  subCategory: z.string().min(1, "Sub Category is required"),
  productCode: z.string().min(1, "Product Code is required"),
  productName: z.string().min(1, "Product Name is required"),
  stock: z.preprocess((val) => {
    // Handle string values with apostrophes
    if (typeof val === "string") {
      // Remove any apostrophes or other non-numeric characters except digits
      const cleaned = val.replace(/[^\d.-]/g, "");

      return cleaned ? Number(cleaned) : 0;
    }
    return val === null ? 0 : val;
  }, z.number().int().min(0, "Stock cannot be negative").default(0)),
});

const uploadExcel = z.object({
  params: z.object({
    branchId: branchId,
  }),
});

const remove = z.object({
  params: z.object({
    id,
  }),
});

// Validation for Get All Stocks (company)
const getAll = z.object({
  query: z.object({
    page: z.coerce.number().positive().int().default(1),
    limit: z.coerce.number().positive().int().default(10),
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

export type TUpdateStock = z.infer<typeof add>["body"];
export type TDeleteStock = z.infer<typeof remove>["params"];
export type TUploadExcel = z.infer<typeof uploadExcel>;
export type TGetAllStocks = z.infer<typeof getAll>["query"];
export type TGetStockById = z.infer<typeof getById>["params"];
export type TGetStockByBranch = z.infer<typeof getByBranch>["params"];

// Exporting all schemas
export const validateStock = {
  add,
  uploadExcel,
  remove,
  getAll,
  getById,
  getByBranch,
};
