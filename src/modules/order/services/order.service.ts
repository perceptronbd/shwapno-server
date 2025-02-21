import {
  TGetAllOrder,
  TGetByBranchOrder,
  TUpdateStatusOrder,
} from "../validator/order.validate";
import { HTTP_STATUS_CODES } from "@/utils/http-status-codes";
import { orderModel } from "../models/order.model";
import { AppError } from "@/types/error.type";

const getAll = async ({ userId, page = 1, limit = 10 }: TGetAllOrder) => {
  const result = await orderModel.getAll({ userId, page, limit });
  if (!result.orders.length) {
    throw new AppError(HTTP_STATUS_CODES.NOT_FOUND, "No orders found");
  }
  return result;
};

const getByBranch = async ({ branchId, page, limit }: TGetByBranchOrder) => {
  const result = await orderModel.getByBranch({ branchId, page, limit });
  if (!result.orders.length) {
    throw new AppError(HTTP_STATUS_CODES.NOT_FOUND, "No orders found");
  }
  return result;
};

const getById = async (id: string) => {
  const order = await orderModel.getById(id);
  if (!order) {
    throw new AppError(HTTP_STATUS_CODES.NOT_FOUND, "Order not found");
  }
  return order;
};

const updateStatus = async ({ id, status }: TUpdateStatusOrder) => {
  const order = await orderModel.getById(id);
  if (!order) {
    throw new AppError(HTTP_STATUS_CODES.NOT_FOUND, "Order not found");
  }
  return await orderModel.updateStatus(id, status);
};

const remove = async (id: string) => {
  const order = await orderModel.getById(id);
  if (!order) {
    throw new AppError(HTTP_STATUS_CODES.NOT_FOUND, "Order not found");
  }
  return await orderModel.remove(id);
};

export const orderService = {
  getAll,
  getByBranch,
  getById,
  updateStatus,
  remove,
};
