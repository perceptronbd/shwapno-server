import { orderData } from "@/tests/utils/test-data";
import { orderModel } from "../models/order.model";
import { orderService } from "./order.service";

jest.mock("../models/order.model", () => ({
  orderModel: {
    updateStatus: jest.fn(),
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
    it("should update order status", async () => {
      (orderModel.getById as jest.Mock).mockResolvedValue(orderData.id);
      (orderModel.updateStatus as jest.Mock).mockResolvedValue(orderData);

      const result = await orderService.updateStatus({
        id: "1",
        status: "COMPLETED",
      });

      expect(orderModel.updateStatus).toHaveBeenCalledWith({
        id: "1",
        status: "COMPLETED",
      });
      expect(result).toEqual(orderData);
    });
  });

  describe("Remove Order", () => {
    it("should remove an order", async () => {
      (orderModel.getById as jest.Mock).mockResolvedValue(orderData.id);
      (orderModel.remove as jest.Mock).mockResolvedValue(orderData.id);

      const result = await orderService.remove(orderData.id);

      expect(orderModel.getById).toHaveBeenCalledWith(orderData.id);
      expect(orderModel.remove).toHaveBeenCalledWith(orderData.id);
      expect(result).toEqual({ result: "success" });
    });
  });
});
