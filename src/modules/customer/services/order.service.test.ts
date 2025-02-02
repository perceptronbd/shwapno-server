import { cartData, customerData, orderData } from "@/tests/utils/test-data";
import { orderModel } from "../models/order.model";
import { orderService } from "./order.service";

jest.mock("../models/order.model");
jest.mock("@/utils/generate", () => ({
  generateSessionId: jest.fn(),
}));

describe("Order Service", () => {
  const { id: custId, ...customer } = customerData;
  const { id: orderId, ..._order } = orderData;
  const { sessionId, ..._cart } = cartData;
  const branchId = "branch-001"
  describe("Create Order", () => {
    it("should create an order", async () => {
      (orderModel.create as jest.Mock).mockResolvedValue(orderData);

      const result = await orderService.create({ customer, sessionId, branchId });

      expect(result).toEqual(orderData);
      expect(await orderModel.create({ customer, sessionId, branchId })).toEqual(orderData);
      
      expect(orderModel.create).toHaveBeenCalledWith({ customer, sessionId,branchId });
    });
  });

  describe("Track Order", () => {
    it("should track an order", async () => {
      (orderModel.findOne as jest.Mock).mockResolvedValue(orderData);

      const result = await orderService.track({ id: custId });

      expect(result).toEqual(orderData);
      expect(orderModel.findOne).toHaveBeenCalledWith(custId);
    });
  });
});
