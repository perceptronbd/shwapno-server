import { HTTP_STATUS_CODES } from "@/utils/http-status-codes";
import { sendResponse } from "@/handlers/response.handler";
import { orderService } from "../services/order.service";
import { AuthRequest } from "@/types/auth.types";
import { Request, Response } from "express";

const getAll = async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const userId = req.user!.id;

  const result = await orderService.getAll({ userId, page, limit });

  sendResponse(
    res,
    result,
    HTTP_STATUS_CODES.OK,
    "Orders retrieved successfully",
  );
};

const getByBranch = async (req: Request, res: Response) => {
  const { branchId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const result = await orderService.getByBranch({ branchId, page, limit });

  sendResponse(
    res,
    result,
    HTTP_STATUS_CODES.OK,
    "Orders retrieved successfully",
  );
};

const getById = async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await orderService.getById(id);

  sendResponse(
    res,
    order,
    HTTP_STATUS_CODES.OK,
    "Order retrieved successfully",
  );
};

const updateStatus = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = await orderService.updateStatus({ id, status });

  sendResponse(
    res,
    order,
    HTTP_STATUS_CODES.OK,
    "Order status updated successfully",
  );
};

const remove = async (req: Request, res: Response) => {
  const { id } = req.params;
  await orderService.remove(id);

  sendResponse(res, null, HTTP_STATUS_CODES.OK, "Order deleted successfully");
};

export const orderController = {
  getAll,
  getByBranch,
  getById,
  updateStatus,
  remove,
};
