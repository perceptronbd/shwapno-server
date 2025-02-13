import { orderData } from "@/tests/utils/test-data";
import { orderModel } from "../models/order.model";
import { orderService } from "./order.service";
import prisma from "@/config/db.config";

jest.mock("../models/order.model", () => ({
  updateStatus: jest.fn(),
}));
jest.mock("@/config/db.config", () => ({
  $transaction: jest.fn(),
  order: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
}));

describe("Order Service", () => {
  beforeEach(() => {
    (prisma.$transaction as jest.Mock).mockImplementation((fn) => fn(prisma));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Get Orders", () => {
    it("should get all orders by branch Id", async () => {
      const mockOrdersData = [orderData, orderData];

      (prisma.order.findMany as jest.Mock).mockResolvedValue(mockOrdersData);

      const result = await orderService.getByBranch({
        branchId: "1",
        page: 1,
        limit: 10,
      });

      expect(prisma.order.findMany).toHaveBeenCalledWith({
        where: { branchId: "1" },
      });
      expect(result).toEqual(mockOrdersData);
    });

    it("should get an order by Id", async () => {
      (prisma.order.findUnique as jest.Mock).mockResolvedValue([orderData]);

      const result = await orderService.getById("1");

      expect(prisma.order.findUnique).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(result).toEqual(orderData);
    });
  });

  describe("Update Order Status", () => {
    it("should update order status", async () => {
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
      (prisma.order.delete as jest.Mock).mockResolvedValue(orderData);

      const result = await orderService.remove("1");

      expect(prisma.order.delete).toHaveBeenCalledWith({
        where: { id: "1" },
      });
      expect(result).toEqual({ result: "success" });
    });
  });
});
