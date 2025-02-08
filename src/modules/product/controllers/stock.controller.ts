import { HTTP_STATUS_CODES } from "@/utils/http-status-codes";
import { sendResponse } from "@/handlers/response.handler";
import { stockService } from "../services/stock.service";
import { Response, Request } from "express";

const create = async (req: Request, res: Response) => {
  const stock = await stockService.create(req.body);
  sendResponse(
    res,
    stock,
    HTTP_STATUS_CODES.CREATED,
    "Stock created successfully",
  );
};

const update = async (req: Request, res: Response) => {
  const { branchId } = req.params;
  const stock = await stockService.update({ branchId, data: req.body });
  sendResponse(res, stock, HTTP_STATUS_CODES.OK, "Stock updated successfully");
};

const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  const stock = await stockService.remove({ id });
  sendResponse(res, stock, HTTP_STATUS_CODES.OK, "Stock deleted successfully");
};

const getAll = async (_req: Request, res: Response) => {
  const stocks = await stockService.getAll();

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
  create,
  update,
  remove,
  getAll,
  getById,
  getByBranch,
};
