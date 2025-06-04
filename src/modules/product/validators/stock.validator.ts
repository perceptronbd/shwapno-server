import { z } from "zod";

// ID schema for  validation
const id = z.string({ invalid_type_error: "Invalid ID format" });
const branchId = z.string({ invalid_type_error: "Invalid ID format" });

// Schema for productId
const productId = z.string({ invalid_type_error: "Invalid ID format" });
const quantity = z.number().int().positive().default(1);

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

// Add price to your schema validation
export const excelRowSchema = z.object({
  subCategory: z.string().min(1, "Sub-category is required"),
  productCode: z.string().min(1, "Product code is required"),
  productName: z.string().min(1, "Product name is required"),
  packSize: z.string().optional(), // Make packSize optional
  stock: z.preprocess((val): number => {
    if (typeof val === "string") {
      const cleaned = val.replace(/[^\d.-]/g, "");
      const num = cleaned ? Number(cleaned) : null;
      return num && num > 0 ? num : 0;
    }
    const numVal = typeof val === "number" ? val : 0;
    return numVal > 0 ? numVal : 0;
  }, z.number().int().positive("Stock must be greater than 0").nullable()),
  price: z.preprocess((val): number => {
    if (typeof val === "string") {
      const cleaned = val.replace(/[^\d.-]/g, "");
      const num = cleaned ? Number(cleaned) : 0;
      return isNaN(num) ? 0 : num;
    }
    return typeof val === "number" ? val : 0;
  }, z.number().nonnegative("Price must be a non-negative number")),
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
