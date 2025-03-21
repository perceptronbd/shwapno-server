import { excelRowSchema, TUpdateStock } from "../validators/stock.validator";
import { stockModel } from "../models/stock.model";
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
  fileBuffer,
}: {
  branchId: string;
  fileBuffer: Buffer;
}) => {
  console.log(
    "🚀processExcelUpload ~ fileBuffer length:",
    fileBuffer?.length || 0,
  );

  try {
    const pendingOrders = await prisma.order.findMany({
      where: {
        status: {
          in: ["PENDING", "PROCESSING"],
        },
      },
      include: {
        items: {
          select: {
            productId: true,
          },
        },
      },
    });

    if (pendingOrders.length > 0) {
      throw new Error(
        "Cannot update stock. Complete pending or processing orders first.",
      );
    }
    // Check if fileBuffer is valid
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error("Empty file buffer received");
    }

    // Parse the Excel file with specific options for XLSB format
    console.log("Attempting to parse Excel file...");
    const workbook = XLSX.read(fileBuffer, {
      type: "buffer",
      cellFormula: false,
      cellHTML: false,
      cellText: false,
      cellStyles: false,
      bookVBA: false,
    });
    console.log("Excel file parsed successfully");

    // Check if workbook has sheets
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      throw new Error("Excel file contains no sheets");
    }

    const sheetName = workbook.SheetNames[0];
    console.log("Using sheet:", sheetName);
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      throw new Error("Could not access worksheet data");
    }

    // Define a proper interface for Excel row data - adjust column names based on your actual Excel structure
    interface ExcelRow {
      [key: string]: unknown;
    }

    // Get raw data first
    const rawData = XLSX.utils.sheet_to_json<ExcelRow>(worksheet, {
      header: 1, // Use array of arrays format
      defval: "", // Default empty string for empty cells
      blankrows: false, // Skip blank rows
    });

    console.log(`Extracted ${rawData.length} raw rows from Excel file`);

    // Skip the first 4 rows and process the rest
    const dataStartRow = 4; // 0-indexed, so this is the 5th row
    const processableData = rawData.slice(dataStartRow);

    // Log the first few rows to debug
    console.log("First few rows after skipping header:");
    processableData.slice(0, 3).forEach((row, idx) => {
      console.log(`Row ${idx + dataStartRow + 1}:`, JSON.stringify(row));
    });

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

    // Check for any pending or processing orders

    const results = {
      processed: 0,
      created: 0,
      updated: 0,
      errors: [] as { row: number; message: string }[],
    };

    // Process each row
    for (let i = 0; i < processableData.length; i++) {
      try {
        const rowArray = processableData[i] as unknown as unknown[];

        // Log the raw row data for debugging
        if (i < 3 || i === processableData.length - 1) {
          console.log(
            `Row ${i + dataStartRow + 1} data:`,
            JSON.stringify(rowArray),
          );
        }

        // Skip rows that don't have enough data
        if (!rowArray || rowArray.length < 4) {
          results.errors.push({
            row: i + dataStartRow + 1,
            message: "Row doesn't have enough columns",
          });
          continue;
        }

        // Extract data from specific columns (adjust indices as needed)
        const validationInput = {
          subCategory: String(rowArray[0] || ""),
          productCode: String(rowArray[1] || ""),
          productName: String(rowArray[2] || ""),
          packSize: String(rowArray[3] || ""), // This is the Pack Size column
          stock: String(rowArray[4] || "0"),
          price: String(rowArray[5] || "0"), // Price is in column 6 (index 5)
        };

        // Log validation input for debugging
        if (i < 3 || i === processableData.length - 1) {
          console.log(
            `Row ${i + dataStartRow + 1} validation input:`,
            JSON.stringify(validationInput),
          );
        }

        // Add this debug log before validation to see what's being extracted
        console.log("Price before validation:", validationInput.price);

        const validatedRow = excelRowSchema.safeParse(validationInput);

        // Add this debug log to see the validation result
        console.log(
          "Validation result:",
          validatedRow.success ? "Success" : "Failed",
        );
        if (validatedRow.success) {
          console.log("Validated price:", validatedRow.data.price);
        }

        if (!validatedRow.success) {
          const errorDetails = validatedRow.error.format();
          // Fix the type issue with error formatting
          let errorMessage = "Validation error";

          try {
            errorMessage = Object.entries(errorDetails)
              .filter(([key]) => key !== "_errors")
              .map(([key, value]) => {
                // Handle the type correctly
                const errors =
                  typeof value === "object" &&
                  value !== null &&
                  "_errors" in value
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
            row: i + 2, // +2 because Excel is 1-indexed and has header row
            message: errorMessage || validatedRow.error.message,
          });
          continue;
        }

        const { subCategory, productCode, productName, price, stock } =
          validatedRow.data;

        // Skip products with no stock
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

        // First try to find product by barcode
        let product = await prisma.product.findFirst({
          where: { barcode: productCode },
        });

        // If found by barcode, update the price
        if (product) {
          // Always update price when product is found
          product = await prisma.product.update({
            where: { id: product.id },
            data: {
              price: Number(price) || 0,
              categoryId: category.id,
            },
          });
        }
        // If not found by barcode, try to find by name
        else {
          product = await prisma.product.findFirst({
            where: { name: productName },
          });

          // If found by name, update the barcode and price
          if (product) {
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

        // If product still not found, create a new one
        if (!product) {
          product = await prisma.product.create({
            data: {
              barcode: productCode,
              name: productName,
              price: Number(price) || 0, // Use Number instead of parseFloat
              categoryId: category.id,
            },
          });
          results.created++;
        }

        // Update or create stock
        const existingStock = await prisma.stock.findFirst({
          where: {
            branchId,
            productId: product.id,
          },
        });

        if (existingStock) {
          await prisma.stock.update({
            where: { id: existingStock.id },
            data: { quantity: stock ?? 0 },
          });
        } else {
          await prisma.stock.create({
            data: {
              branchId,
              productId: product.id,
              quantity: stock ?? 0,
            },
          });
        }

        results.updated++;
        results.processed++;
      } catch (error) {
        results.errors.push({
          row: i + 2,
          message: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    console.log("🚀 ~ results:", results);

    return results;
  } catch (error) {
    throw new Error(
      `Failed to process Excel file: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
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
