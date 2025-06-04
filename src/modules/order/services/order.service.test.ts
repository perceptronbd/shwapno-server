import { orderData } from "@/tests/utils/test-data";
import { orderModel } from "../models/order.model";
import { orderService } from "./order.service";
import { AppError } from "@/types/error.type";

jest.mock("../models/order.model", () => ({
  orderModel: {
    getAll: jest.fn(),
    updateStatus: jest.fn(),
    updateStatusWithStockDeduction: jest.fn(),
    getByBranch: jest.fn(),
    getById: jest.fn(),
    remove: jest.fn(),
  },
}));

describe("Order Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Get Orders", () => {
    it("should get all orders by branch Id", async () => {
      const mockOrdersData = [orderData, orderData];
      const mockResult = {
        orders: mockOrdersData,
        total: mockOrdersData.length,
        page: 1,
        limit: 10,
      };
      (orderModel.getByBranch as jest.Mock).mockResolvedValue(mockResult);

      const result = await orderService.getByBranch({
        branchId: "1",
        page: 1,
        limit: 10,
      });

      expect(orderModel.getByBranch).toHaveBeenCalledWith({
        branchId: "1",
        page: 1,
        limit: 10,
      });
      expect(result).toEqual(mockResult);
    });

    it("should get an order by Id", async () => {
      const id = "1";
      (orderModel.getById as jest.Mock).mockResolvedValue(orderData);

      const result = await orderService.getById(id);

      expect(orderModel.getById).toHaveBeenCalledWith(id);
      expect(result).toEqual(orderData);
    });
  });

  describe("Update Order Status", () => {
    it("should update order status for non-PENDING to PROCESSING transitions", async () => {
      const mockOrder = { ...orderData, status: "COMPLETED" };
      (orderModel.getById as jest.Mock).mockResolvedValue(mockOrder);
      (orderModel.updateStatus as jest.Mock).mockResolvedValue(mockOrder);

      const result = await orderService.updateStatus({
        id: "1",
        status: "COMPLETED",
      });

      expect(orderModel.updateStatus).toHaveBeenCalledWith({
        id: "1",
        status: "COMPLETED",
      });
      expect(orderModel.updateStatusWithStockDeduction).not.toHaveBeenCalled();
      expect(result).toEqual(mockOrder);
    });

    it("should use stock deduction when updating from PENDING to PROCESSING", async () => {
      const pendingOrder = {
        ...orderData,
        id: "1",
        status: "PENDING",
        branchId: "branch-123",
      };
      const updatedOrder = { ...pendingOrder, status: "PROCESSING" };

      (orderModel.getById as jest.Mock).mockResolvedValue(pendingOrder);
      (
        orderModel.updateStatusWithStockDeduction as jest.Mock
      ).mockResolvedValue(updatedOrder);

      const result = await orderService.updateStatus({
        id: "1",
        status: "PROCESSING",
      });

      expect(orderModel.updateStatusWithStockDeduction).toHaveBeenCalledWith(
        "1",
        "PROCESSING",
        "branch-123",
      );
      expect(orderModel.updateStatus).not.toHaveBeenCalled();
      expect(result).toEqual(updatedOrder);
    });

    it("should handle errors during stock deduction", async () => {
      const pendingOrder = {
        ...orderData,
        id: "1",
        status: "PENDING",
        branchId: "branch-123",
      };

      (orderModel.getById as jest.Mock).mockResolvedValue(pendingOrder);
      (
        orderModel.updateStatusWithStockDeduction as jest.Mock
      ).mockRejectedValue(new Error("Insufficient stock"));

      await expect(
        orderService.updateStatus({
          id: "1",
          status: "PROCESSING",
        }),
      ).rejects.toThrow(AppError);

      expect(orderModel.updateStatusWithStockDeduction).toHaveBeenCalledWith(
        "1",
        "PROCESSING",
        "branch-123",
      );
      expect(orderModel.updateStatus).not.toHaveBeenCalled();
    });
  });

  describe("Remove Order", () => {
    it("should remove an order", async () => {
      (orderModel.getById as jest.Mock).mockResolvedValue(orderData);
      (orderModel.remove as jest.Mock).mockResolvedValue(orderData.id);

      const result = await orderService.remove(orderData.id);

      expect(orderModel.getById).toHaveBeenCalledWith(orderData.id);
      expect(orderModel.remove).toHaveBeenCalledWith(orderData.id);
      expect(result).toEqual({ result: "success" });
    });
  });
});
