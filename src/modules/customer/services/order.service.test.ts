import { cartData, customerData, orderData } from "@/tests/utils/test-data";
import { orderService } from "./order.service";
import prisma from "@/config/db.config";

jest.mock("@/utils/generate", () => ({
  generateSessionId: jest.fn(),
}));
jest.mock("@/config/db.config", () => ({
  order: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
}));

describe("Order Service", () => {
  const { id: custId, ...customer } = customerData;
  const { id: orderId, ...order } = orderData;
  const { id: cardId, ..._cart } = cartData;
  describe("Create Order", () => {
    it("should create an order", async () => {
      (prisma.order.create as jest.Mock).mockResolvedValue(order);

      const result = await orderService.create({ customer, cardId });

      expect(result).toEqual(orderData);
      expect(prisma.order.create).toHaveBeenCalled();
    });

    it("should update an order", async () => {
      (prisma.order.update as jest.Mock).mockResolvedValue(orderData);

      const result = await orderService.create({ customer, cardId });

      expect(result).toEqual(orderData);
      expect(prisma.order.update).toHaveBeenCalled();
    });
  });

  describe("Track Order", () => {
    it("should track an order", async () => {
      (prisma.order.findUnique as jest.Mock).mockResolvedValue(orderData);

      const result = await orderService.track({ id: custId });

      expect(result).toEqual(orderData);
      expect(prisma.order.findUnique).toHaveBeenCalledWith({
        where: { id: custId },
      });
    });
  });
});
