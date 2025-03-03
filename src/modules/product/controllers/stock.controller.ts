import { HTTP_STATUS_CODES } from "@/utils/http-status-codes";
import { sendResponse } from "@/handlers/response.handler";
import { stockService } from "../services/stock.service";
import { AuthRequest } from "@/types/auth.types";
import { Response, Request } from "express";

const add = async (req: Request, res: Response) => {
  const { branchId } = req.params;
  const stock = await stockService.add({ branchId, data: req.body });
  sendResponse(res, stock, HTTP_STATUS_CODES.OK, "Stock added successfully");
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
  remove,
  getAll,
  getById,
  getByBranch,
};
