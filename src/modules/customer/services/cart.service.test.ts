import { cartData, productData } from "@/tests/utils/test-data";
import { generateSessionId } from "@/utils/generate";
import { cartModel } from "../models/cart.model";
import { cartService } from "./cart.service";

jest.mock("../models/cart.model");
jest.mock("@/utils/generate", () => ({
  generateSessionId: jest.fn(),
}));

describe("Cart Service", () => {
  describe("Add Product to Cart", () => {
    it("should create cart and add a product to cart", async () => {
      const { customerId: _, ...cartResult } = cartData;

      const mockSessionId = cartData.sessionId;

      (generateSessionId as jest.Mock).mockReturnValue(mockSessionId);
      (cartModel.create as jest.Mock).mockResolvedValue(cartResult);

      const result = await cartService.add({
        productId: productData.id,
        quantity: 2,
      });

      expect(result).toEqual(cartResult);
      expect(cartModel.create).toHaveBeenCalledWith({
        sessionId: mockSessionId,
        productId: productData.id,
        quantity: 2,
      });
    });

    it("should update cart and add a product to cart", async () => {
      const { customerId: _, ...cartResult } = cartData;

      (cartModel.create as jest.Mock).mockResolvedValue(cartResult);

      const result = await cartService.add({
        sessionId: cartData.sessionId,
        productId: productData.id,
        quantity: 2,
      });

      expect(result).toEqual(cartResult);
      expect(cartModel.create).toHaveBeenCalledWith({
        sessionId: cartData.sessionId,
        productId: productData.id,
        quantity: 2,
      });
      expect(generateSessionId).not.toHaveBeenCalled();
    });
  });

  describe("Update Product in Cart", () => {
    it("should update product in cart", async () => {
      const { customerId: _, ...cartResult } = cartData;

      (cartModel.update as jest.Mock).mockResolvedValue(cartResult);

      const result = await cartService.update([
        { productId: productData.id, quantity: 2 },
      ]);

      expect(result).toEqual(cartResult);
      expect(cartModel.update).toHaveBeenCalledWith({
        sessionId: cartData.sessionId,
        productId: productData.id,
        quantity: 2,
      });
    });

    it("should handle errors", async () => {
      (cartModel.update as jest.Mock).mockRejectedValue(new Error("Error"));

      await expect(cartService.update([])).rejects.toThrow();
    });
  });

  describe("Get Cart", () => {
    it("should get cart", async () => {
      const { customerId: _, ...cartResult } = cartData;

      (cartModel.findOne as jest.Mock).mockResolvedValue(cartResult);

      const result = await cartService.get(cartData.id);

      expect(result).toEqual(cartResult);
      expect(cartModel.findOne).toHaveBeenCalledWith(cartData.id);
    });
  });
});
