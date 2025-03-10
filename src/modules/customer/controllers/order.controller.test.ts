import { cartData, customerData, orderData } from "@/tests/utils/test-data";
import { HTTP_STATUS_CODES } from "@utils/http-status-codes";
import { sendResponse } from "@handlers/response.handler";
import { orderService } from "../services/order.service";
import { orderController } from "./order.controller";
import { mocks } from "@/tests/utils/mocks";
import { Request, Response } from "express";

// Mock dependencies
jest.mock("@handlers/response.handler");
jest.mock("../services/order.service");

describe("Order Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const { id: custId, ...customer } = customerData;
  const { sessionId, ..._cart } = cartData;
  const branchId = "branch-001";

  describe("Create Order", () => {
    it("should create an order", async () => {
      const { req, res } = mocks.createMockReqRes({
        body: { customer, sessionId },
        params: { id: branchId },
      });

      (orderService.create as jest.Mock).mockResolvedValue(orderData);

      await orderController.create(req as Request, res as Response);

      expect(orderService.create).toHaveBeenCalledWith({
        customer,
        sessionId,
        branchId,
      });
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        orderData,
        HTTP_STATUS_CODES.CREATED,
        "Order created successfully",
      );
    });

    it("should handle errors", async () => {
      const { req, res } = mocks.createMockReqRes({
        body: { customer, sessionId },
        params: { id: branchId },
      });

      (orderService.create as jest.Mock).mockRejectedValue(new Error("Error"));

      await expect(
        orderController.create(req as Request, res as Response),
      ).rejects.toThrow();

      expect(orderService.create).toHaveBeenCalledWith({
        customer,
        sessionId,
        branchId,
      });
    });
  });
});
