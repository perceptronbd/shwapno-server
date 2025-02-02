import { HTTP_STATUS_CODES } from "@/utils/http-status-codes";
import { orderModel } from "../models/order.model";
import { TOrderPayload } from "../types/order";
import { AppError } from "@/types/error.type";

const create = async ({ customer, sessionId, branchId }: TOrderPayload) => {
  const result = await orderModel.create({ customer, sessionId, branchId });
  if (!result) {
    throw new AppError(HTTP_STATUS_CODES.BAD_REQUEST, "Failed to create order");
  }
  return result;
};

const track = async ({ id }: { id: string }) => {
  return await orderModel.findOne(id);
};

export const orderService = {
  create,
  track,
};
