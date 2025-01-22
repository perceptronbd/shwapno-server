import { cartData, productData } from "@/tests/utils/test-data";
import { generateSessionId } from "@/utils/generate";
import { cartService } from "./cart.service";
import prisma from "@/config/db.config";

jest.mock("@/utils/generate", () => ({
  generateSessionId: jest.fn(),
}));
jest.mock("@/config/db.config", () => ({
  shoppingCart: {
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
}));

describe("Cart Service", () => {
  describe("Add Product to Cart", () => {
    it("should create cart and add a product to cart", async () => {
      const { id, ...cart } = cartData;

      const mockSessionId = cartData.sessionId;

      (generateSessionId as jest.Mock).mockReturnValue(mockSessionId);
      (prisma.shoppingCart.create as jest.Mock).mockResolvedValue(cart);

      const result = await cartService.add({
        productId: productData.id,
        quantity: 2,
      });

      expect(result).toEqual(cartData);
      expect(prisma.shoppingCart.create).toHaveBeenCalledWith({
        data: {
          sessionId: mockSessionId,
          productId: productData.id,
          quantity: 2,
        },
      });
    });

    it("should update cart and add a product to cart", async () => {
      (prisma.shoppingCart.update as jest.Mock).mockResolvedValue(cartData);

      const result = await cartService.add({
        sessionId: cartData.sessionId,
        productId: productData.id,
        quantity: 2,
      });

      expect(result).toEqual(cartData);
      expect(prisma.shoppingCart.update).toHaveBeenCalledWith({
        where: { sessionId: cartData.sessionId },
        data: {
          productId: productData.id,
          quantity: 2,
        },
      });
    });
  });

  describe("Update Product in Cart", () => {
    it("should update product in cart", async () => {
      (prisma.shoppingCart.update as jest.Mock).mockResolvedValue(cartData);

      const result = await cartService.update([
        { productId: productData.id, quantity: 2 },
      ]);

      expect(result).toEqual(cartData);
      expect(prisma.shoppingCart.update).toHaveBeenCalledWith({
        where: { id: cartData.id },
        data: {
          items: {
            updateMany: [
              {
                where: { productId: productData.id },
                data: { quantity: 2 },
              },
            ],
          },
        },
      });
    });

    it("should handle errors", async () => {
      (prisma.shoppingCart.update as jest.Mock).mockRejectedValue(
        new Error("Error"),
      );

      await expect(cartService.update([])).rejects.toThrow("Service Error");
    });
  });

  describe("Get Cart", () => {
    it("should get cart", async () => {
      (prisma.shoppingCart.findUnique as jest.Mock).mockResolvedValue(cartData);

      const result = await cartService.get(cartData.id);

      expect(result).toEqual(cartData);
      expect(prisma.shoppingCart.findUnique).toHaveBeenCalledWith({
        where: { id: cartData.id },
      });
    });
  });
});
