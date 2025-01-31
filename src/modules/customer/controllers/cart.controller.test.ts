import { cartData, productData } from "@/tests/utils/test-data";
import { HTTP_STATUS_CODES } from "@utils/http-status-codes";
import { sendResponse } from "@handlers/response.handler";
import { cartService } from "../services/cart.service";
import { cartController } from "./cart.controller";
import { mocks } from "@/tests/utils/mocks";
import { Request, Response } from "express";

// Mock dependencies
jest.mock("@handlers/response.handler");
jest.mock("../services/cart.service");

describe("Cart Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Add Product to Cart", () => {
    it("should create cart and add a product to cart", async () => {
      const { req, res } = mocks.createMockReqRes({
        body: { productId: productData.id, quantity: 2 },
      });

      (cartService.add as jest.Mock).mockResolvedValue(cartData);

      await cartController.add(req as Request, res as Response);

      expect(cartService.add).toHaveBeenCalledWith({
        productId: productData.id,
        quantity: 2,
      });
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        cartData,
        HTTP_STATUS_CODES.CREATED,
        "Product added to cart successfully",
      );
    });

    it("should update cart and add a product to cart", async () => {
      const { req, res } = mocks.createMockReqRes({
        body: {
          sessionId: cartData.sessionId,
          productId: productData.id,
          quantity: 2,
        },
      });

      (cartService.add as jest.Mock).mockResolvedValue(cartData);

      await cartController.add(req as Request, res as Response);

      expect(cartService.add).toHaveBeenCalledWith({
        sessionId: cartData.sessionId,
        productId: productData.id,
        quantity: 2,
      });
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        cartData,
        HTTP_STATUS_CODES.CREATED,
        "Product added to cart successfully",
      );
    });

    it("should handle errors", async () => {
      const { req, res } = mocks.createMockReqRes({
        body: { productId: "", quantity: -2 },
      });

      (cartService.add as jest.Mock).mockRejectedValue(new Error("Error"));

      await expect(
        cartController.add(req as Request, res as Response),
      ).rejects.toThrow("Error");
      expect(cartService.add).toHaveBeenCalledWith({
        productId: "",
        quantity: -2,
      });
    });
  });

  describe("Update Product in Cart", () => {
    it("should update a product in cart", async () => {
      const { req, res } = mocks.createMockReqRes({
        body: { items: [{ productId: productData.id, quantity: 3 }] },
        params: { id: cartData.id },
      });

      (cartService.update as jest.Mock).mockResolvedValue(cartData);

      await cartController.update(req as Request, res as Response);

      expect(cartService.update).toHaveBeenCalledWith({
        items: req.body?.items,
        cartId: req.params?.id,
      });
    });

    it("should handle errors", async () => {
      const { req, res } = mocks.createMockReqRes({
        body: { items: [{ productId: "", quantity: -3 }] },
        params: { id: cartData.id },
      });

      (cartService.update as jest.Mock).mockRejectedValue(new Error("Error"));

      await expect(
        cartController.update(req as Request, res as Response),
      ).rejects.toThrow();

      expect(cartService.update).toHaveBeenCalledWith({
        items: req.body?.items,
        cartId: req.params?.id,
      });
    });
  });

  describe("Get Cart", () => {
    it("should get cart", async () => {
      const { req, res } = mocks.createMockReqRes({
        params: { id: cartData.id },
      });

      (cartService.get as jest.Mock).mockResolvedValue(cartData);

      await cartController.get(req as Request, res as Response);

      expect(cartService.get).toHaveBeenCalledWith(cartData.id);
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        cartData,
        HTTP_STATUS_CODES.OK,
        "Cart retrieved successfully",
      );
    });

    it("should handle errors", async () => {
      const { req, res } = mocks.createMockReqRes({
        params: { id: "" },
      });

      (cartService.get as jest.Mock).mockRejectedValue(new Error("Error"));

      await expect(
        cartController.get(req as Request, res as Response),
      ).rejects.toThrow();

      expect(cartService.get).toHaveBeenCalledWith("");
    });
  });
});
