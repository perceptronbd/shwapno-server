import { HTTP_STATUS_CODES } from "@/utils/http-status-codes";
import { sendResponse } from "@/handlers/response.handler";
import { stockService } from "../services/stock.service";
import { AuthRequest } from "@/types/auth.types";
import { Response, Request } from "express";
import * as fs from "fs";

const add = async (req: Request, res: Response) => {
  const { branchId } = req.params;
  const stock = await stockService.add({ branchId, data: req.body });
  sendResponse(res, stock, HTTP_STATUS_CODES.OK, "Stock added successfully");
};

const uploadExcel = async (req: Request, res: Response) => {
  const { branchId } = req.params;
  const file = req.file;
  console.log("🚀 ~ uploadExcel ~ file:", file);

  if (!file) {
    return sendResponse(
      res,
      null,
      HTTP_STATUS_CODES.BAD_REQUEST,
      "No file uploaded",
    );
  }

  try {
    // Start processing immediately and send a response
    sendResponse(
      res,
      { message: "File upload received, processing started" },
      HTTP_STATUS_CODES.ACCEPTED,
      "Processing started",
    );

    // Process the file asynchronously after sending the response
    setTimeout(async () => {
      try {
        // Read the file from disk
        const fileBuffer = fs.readFileSync(file.path);
        console.log("🚀 ~ setTimeout ~ processing...:");

        // Process the file
        await stockService.processExcelUpload({
          branchId,
          fileBuffer,
        });

        // Clean up - remove the file after processing
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }

        console.log(`File ${file.originalname} processed successfully`);
      } catch (error) {
        // Clean up in case of error
        if (file.path && fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }

        console.error("Excel upload error:", error);
      }
    }, 100);
  } catch (error) {
    // Handle immediate errors
    if (file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    console.error("Excel upload immediate error:", error);
    sendResponse(
      res,
      null,
      HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR,
      error instanceof Error ? error.message : "Failed to process Excel file",
    );
  }
};

const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  const stock = await stockService.remove({ id });
  sendResponse(res, stock, HTTP_STATUS_CODES.OK, "Stock deleted successfully");
};

const getAll = async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const user = req.user;

  const stocks = await stockService.getAll({ id: user!.id, page, limit });

  sendResponse(
    res,
    stocks,
    HTTP_STATUS_CODES.OK,
    "Stocks retrieved successfully",
  );
};

const getById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const stock = await stockService.getById({ id });
  sendResponse(
    res,
    stock,
    HTTP_STATUS_CODES.OK,
    "Stock retrieved successfully",
  );
};

const getByBranch = async (req: Request, res: Response) => {
  const { branchId } = req.params;
  const stock = await stockService.getByBranch({ branchId });
  sendResponse(
    res,
    stock,
    HTTP_STATUS_CODES.OK,
    "Stocks retrieved successfully",
  );
};

export const stockController = {
  add,
  uploadExcel,
  remove,
  getAll,
  getById,
  getByBranch,
};
