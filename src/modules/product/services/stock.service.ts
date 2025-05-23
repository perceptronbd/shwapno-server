import { excelRowSchema, TUpdateStock } from "../validators/stock.validator";
import { stockModel } from "../models/stock.model";
import { jobStatusService } from "./job.service";
import { ExcelRow } from "../types/stock.type";
import prisma from "@/config/db.config";
import * as XLSX from "xlsx";

const add = async ({
  branchId,
  data,
}: {
  branchId: string;
  data: TUpdateStock;
}) => {
  // Check for pending or processing orders
  const pendingOrders = await prisma.order.findMany({
    where: {
      status: {
        in: ["PENDING", "PROCESSING"],
      },
      items: {
        some: {
          productId: data.productId,
        },
      },
    },
  });

  if (pendingOrders.length > 0) {
    throw new Error(
      "Cannot update stock. Complete pending or processing orders first.",
    );
  }

  const result = await stockModel.addStock({
    branchId,
    productId: data.productId,
    quantity: data.quantity,
  });

  return result;
};

const processExcelUpload = async ({
  branchId,
  jobId,
  fileBuffer,
}: {
  branchId: string;
  jobId: string;
  fileBuffer: Buffer;
}) => {
  try {
    // Initialize job status at the beginning of processing
    await jobStatusService.update(jobId, {
      status: "processing",
      progress: 0,
      processed: 0,
      errors: [],
    });

    // Check for any pending orders that might conflict with stock updates
    // const pendingOrders = await prisma.order.findMany({
    //   where: {
    //     status: {
    //       in: ["PENDING", "PROCESSING"],
    //     },
    //   },
    //   include: {
    //     items: {
    //       select: {
    //         productId: true,
    //       },
    //     },
    //   },
    // });

    // if (pendingOrders.length > 0) {
    //   throw new Error(
    //     "Cannot update stock. Complete pending or processing orders first.",
    //   );
    // }

    // Validate file buffer before processing
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error("Empty file buffer received");
    }

    // Parse Excel file with optimized settings
    const workbook = XLSX.read(fileBuffer, {
      type: "buffer",
      cellFormula: false,
      cellHTML: false,
      cellText: false,
      cellStyles: false,
      bookVBA: false,
    });

    // Ensure the Excel file has at least one sheet
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new Error("Excel file contains no sheets");
    }

    // Get the first sheet (we only process one sheet)
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      throw new Error("Could not access worksheet data");
    }

    // Convert Excel sheet to JSON format
    const rawData = XLSX.utils.sheet_to_json<ExcelRow>(worksheet, {
      header: 1,
      defval: "",
      blankrows: false,
    });

    // Skip header rows (first 1 row)
    const dataStartRow = 1;
    const processableData = rawData.slice(dataStartRow);

    // Handle empty data case
    if (processableData.length === 0) {
      return {
        processed: 0,
        created: 0,
        updated: 0,
        errors: [
          {
            row: 0,
            message: "No data found in Excel file after skipping headers",
          },
        ],
      };
    }

    // Initialize results tracking object
    const results = {
      processed: 0,
      created: 0,
      updated: 0,
      errors: [] as { row: number; message: string }[],
    };

    // Update job with total rows to be processed
    const totalRows = processableData.length;
    await jobStatusService.update(jobId, {
      total: totalRows,
      status: "processing",
    });

    // Process each row in the Excel data
    for (let i = 0; i < processableData.length; i++) {
      try {
        const rowArray = processableData[i] as unknown as unknown[];

        // Skip rows with insufficient data
        if (!rowArray || rowArray.length < 4) {
          results.errors.push({
            row: i + dataStartRow + 1,
            message: "Row doesn't have enough columns",
          });
          continue;
        }

        // Update job progress after each row
        const processed = i + 1;
        await jobStatusService.update(jobId, {
          processed,
          progress: Math.round((processed / totalRows) * 100),
        });

        // Extract data from Excel columns
        const validationInput = {
          subCategory: String(rowArray[0]),
          productCode: String(rowArray[1]),
          productName: String(rowArray[2]),
          packSize: String(rowArray[3]),
          stock: String(rowArray[4]),
          price: String(rowArray[5]),
        };

        // Validate row data using Zod schema
        const validatedRow = excelRowSchema.safeParse(validationInput);

        // Handle validation errors
        if (!validatedRow.success) {
          const errorDetails = validatedRow.error.format();
          let errorMessage = "Validation error";

          try {
            // Format validation errors for better readability
            errorMessage = Object.entries(errorDetails)
              .filter(([key]) => key !== "_errors")
              .map(([key, value]) => {
                const errors =
                  typeof value === "object" && "_errors" in value
                    ? value._errors
                    : [];
                return errors.length ? `${key}: ${errors.join(", ")}` : "";
              })
              .filter(Boolean)
              .join("; ");
          } catch (formatError) {
            console.error("Error formatting validation errors:", formatError);
            errorMessage = validatedRow.error.message;
          }

          results.errors.push({
            row: i + 2, // +2 for Excel's 1-based indexing and header offset
            message: errorMessage || validatedRow.error.message,
          });
          continue;
        }

        // Extract validated data
        const { subCategory, productCode, productName, price, stock } =
          validatedRow.data;

        // Skip products with zero stock
        if (stock === null || stock === 0) {
          results.processed++;
          continue;
        }

        // Find or create category
        let category = await prisma.category.findFirst({
          where: { name: subCategory },
        });

        if (!category) {
          category = await prisma.category.create({
            data: { name: subCategory },
          });
        }

        // Product lookup strategy:
        // 1. Try to find by barcode first
        let product = await prisma.product.findFirst({
          where: { barcode: productCode },
        });

        if (product) {
          // Update existing product found by barcode
          product = await prisma.product.update({
            where: { id: product.id },
            data: {
              price: Number(price) || 0,
              categoryId: category.id,
            },
          });
        } else {
          // 2. If not found by barcode, try to find by name
          product = await prisma.product.findFirst({
            where: { name: productName },
          });

          if (product) {
            // Update existing product found by name
            product = await prisma.product.update({
              where: { id: product.id },
              data: {
                barcode: productCode,
                categoryId: category.id,
                price: Number(price) || 0,
              },
            });
          }
        }

        // 3. If product still not found, create a new one
        if (!product) {
          product = await prisma.product.create({
            data: {
              barcode: productCode,
              name: productName,
              price: Number(price) || 0,
              categoryId: category.id,
            },
          });
        }

        // Find existing stock for this product at this branch
        const existingStock = await prisma.stock.findFirst({
          where: {
            branchId,
            productId: product.id,
          },
        });

        // Update or create stock entry
        if (existingStock) {
          // Update existing stock quantity
          await prisma.stock.update({
            where: { id: existingStock.id },
            data: { quantity: stock ?? 0 },
          });
          results.updated++;
        } else {
          // Create new stock entry
          await prisma.stock.create({
            data: {
              branchId,
              productId: product.id,
              quantity: stock ?? 0,
            },
          });
          results.created++;
        }
      } catch (error) {
        // Handle errors for individual rows
        results.errors.push({
          row: i + 2,
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    // Update job status on successful completion
    await jobStatusService.update(jobId, {
      status: "completed",
      progress: 100,
      result: {
        created: results.created,
        updated: results.updated,
        processed: results.processed,
      },
    });

    return results;
  } catch (error) {
    // Handle global errors and update job status
    await jobStatusService.update(jobId, {
      status: "failed",
      errors: [
        {
          row: 0,
          message: error instanceof Error ? error.message : "Unknown error",
        },
      ],
    });
    throw error;
  }
};

const remove = async ({ id }: { id: string }) => {
  const result = await prisma.stock.delete({
    where: { id },
  });
  return result;
};

const getAll = async ({
  id,
  page,
  limit,
}: {
  id: string;
  page: number;
  limit: number;
}) => {
  const result = await stockModel.getAll({ id, page, limit });

  return result;
};

const getById = async ({ id }: { id: string }) => {
  const result = await prisma.stock.findUnique({
    where: { id },
    include: {
      product: true,
    },
  });
  return result;
};

const getByBranch = async ({ branchId }: { branchId: string }) => {
  const result = await prisma.stock.findMany({
    where: { branchId },
    include: {
      product: true,
    },
  });
  return result;
};

export const stockService = {
  add,
  processExcelUpload,
  remove,
  getAll,
  getById,
  getByBranch,
};
