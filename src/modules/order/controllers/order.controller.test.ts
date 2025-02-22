import { HTTP_STATUS_CODES } from "@utils/http-status-codes";
import { sendResponse } from "@handlers/response.handler";
import { orderService } from "../services/order.service";
import { orderController } from "./order.controller";
import { orderData } from "@/tests/utils/test-data";
import { mocks } from "@/tests/utils/mocks";
import { Request, Response } from "express";

// Mock dependencies
jest.mock("@handlers/response.handler");
jest.mock("../services/order.service");

describe("Order Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Get Order", () => {
    it("should get all orders by branch Id pagination limit", async () => {
      const mockOrdersData = [orderData, orderData];

      const { req, res } = mocks.createMockReqRes({
        params: { branchId: "1" },
        query: { page: "1", limit: "10" },
      });

      (orderService.getByBranch as jest.Mock).mockResolvedValue(mockOrdersData);

      await orderController.getByBranch(req as Request, res as Response);

      expect(orderService.getByBranch).toHaveBeenCalledWith({
        branchId: "1",
        page: 1,
        limit: 10,
      });
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        mockOrdersData,
        HTTP_STATUS_CODES.OK,
        "Orders fetched successfully!",
      );
    });

    it("should get an order by Id", async () => {
      const { req, res } = mocks.createMockReqRes({
        params: { id: "1" },
      });

      (orderService.getById as jest.Mock).mockResolvedValue(orderData);

      await orderController.getById(req as Request, res as Response);

      expect(orderService.getById).toHaveBeenCalledWith("1");
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        orderData,
        HTTP_STATUS_CODES.OK,
        "Orders fetched successfully!",
      );
    });
  });

  describe("Update Order Status", () => {
    it("should update order status", async () => {
      const { req, res } = mocks.createMockReqRes({
        params: { id: "1" },
        body: { status: "COMPLETED" },
      });

      (orderService.updateStatus as jest.Mock).mockResolvedValue(orderData);

      await orderController.updateStatus(req as Request, res as Response);

      expect(orderService.updateStatus).toHaveBeenCalledWith({
        id: "1",
        status: "COMPLETED",
      });
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        orderData,
        HTTP_STATUS_CODES.OK,
        "Order status updated successfully",
      );
    });

    it("should handle errors", async () => {
      const { req, res } = mocks.createMockReqRes({
        params: { id: "1" },
        body: { status: "COMPLETED" },
      });

      (orderService.updateStatus as jest.Mock).mockRejectedValue(
        new Error("Error"),
      );

      await expect(
        orderController.updateStatus(req as Request, res as Response),
      ).rejects.toThrow();

      expect(orderService.updateStatus).toHaveBeenCalledWith({
        id: "1",
        status: "COMPLETED",
      });
    });
  });

  describe("Remove Order", () => {
    it("should remove an order", async () => {
      const { req, res } = mocks.createMockReqRes({
        params: { id: "1" },
      });

      (orderService.remove as jest.Mock).mockResolvedValue({
        result: "success",
      });

      await orderController.remove(req as Request, res as Response);

      expect(orderService.remove).toHaveBeenCalledWith("1");
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        null,
        HTTP_STATUS_CODES.OK,
        "Order deleted successfully",
      );
    });
  });
});
