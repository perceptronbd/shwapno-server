import { HTTP_STATUS_CODES } from "@/utils/http-status-codes";
import { sendResponse } from "@/handlers/response.handler";
import { orderService } from "../services/order.service";
import { Request, Response } from "express";

export const create = async (req: Request, res: Response): Promise<void> => {
  const { customer, sessionId } = req.body;
  // Call the orderService.create method to create the order
  const orderData = await orderService.create({
    customer,
    sessionId,
    branchId: req?.params?.id,
  });

  // Send a success response
  sendResponse(
    res,
    orderData,
    HTTP_STATUS_CODES.CREATED,
    "Order created successfully",
  );
};

const track = async (_req: Request, _res: Response) => {};

export const orderController = {
  create,
  track,
};
