import { productService } from "../services/product.service";
import { HTTP_STATUS_CODES } from "@utils/http-status-codes";
import { sendResponse } from "@handlers/response.handler";
import { productController } from "./product.controller";
import { productData } from "@/tests/utils/test-data";
import { mocks } from "@/tests/utils/mocks";
import { Request, Response } from "express";

// Mock dependencies
jest.mock("@handlers/response.handler");
jest.mock("../services/product.service");

describe("Product Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const { id, ...product } = productData;

  const mockProducts = [
    {
      ...productData,
    },
  ];

  describe("Create Product", () => {
    it("should create a product", async () => {
      const { req, res } = mocks.createMockReqRes({
        body: product,
      });

      const mockResult = { id: 1, ...req.body };

      (productService.create as jest.Mock).mockResolvedValue(mockResult);

      await productController.create(req as Request, res as Response);

      expect(productService.create).toHaveBeenCalledWith(req.body);
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        mockResult,
        HTTP_STATUS_CODES.CREATED,
        "Product created successfully",
      );
    });

    it("should handle errors", async () => {
      const { req, res } = mocks.createMockReqRes({
        body: { name: "", price: -100, barcode: "" },
      });

      (productService.create as jest.Mock).mockRejectedValue(
        new Error("Error"),
      );

      await expect(
        productController.create(req as Request, res as Response),
      ).rejects.toThrow("Service Error");

      expect(productService.create).toHaveBeenCalledWith(req.body);
      expect(sendResponse).not.toHaveBeenCalled();
    });
  });

  describe("Update Product", () => {
    it("should update a product", async () => {
      const { req, res } = mocks.createMockReqRes({
        body: product,
        params: { id },
      });

      (productService.update as jest.Mock).mockResolvedValue(productData);

      await productController.update(req as Request, res as Response);

      expect(productService.update).toHaveBeenCalledWith({
        id: req.params?.id,
        productData: req.body,
      });
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        productData,
        HTTP_STATUS_CODES.OK,
        "Product updated successfully",
      );
    });

    it("should handle errors", async () => {
      const { req, res } = mocks.createMockReqRes({
        body: { name: "", price: -100, barcode: "" },
        params: { id },
      });

      (productService.update as jest.Mock).mockRejectedValue(
        new Error("Error"),
      );

      await expect(
        productController.update(req as Request, res as Response),
      ).rejects.toThrow("Service Error");

      expect(productService.update).toHaveBeenCalledWith({
        id: req.params?.id,
        productData: req.body,
      });
      expect(sendResponse).not.toHaveBeenCalled();
    });
  });

  describe("Delete Product", () => {
    it("should delete a product", async () => {
      const { req, res } = mocks.createMockReqRes({
        params: { id },
      });

      const mockResult = { id: "1" };

      (productService.remove as jest.Mock).mockResolvedValue(mockResult);

      await productController.remove(req as Request, res as Response);

      expect(productService.remove).toHaveBeenCalledWith({
        id: req.params?.id,
      });
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        mockResult,
        HTTP_STATUS_CODES.OK,
        "Product deleted successfully",
      );
    });

    it("should handle errors", async () => {
      const { req, res } = mocks.createMockReqRes({
        params: { id },
      });

      (productService.remove as jest.Mock).mockRejectedValue(
        new Error("Error"),
      );

      await expect(
        productController.remove(req as Request, res as Response),
      ).rejects.toThrow("Service Error");

      expect(productService.remove).toHaveBeenCalledWith({
        id: req.params?.id,
      });
      expect(sendResponse).not.toHaveBeenCalled();
    });
  });

  describe("Get All Products", () => {
    it("should get all products", async () => {
      const { req, res } = mocks.createMockReqRes();

      (productService.getAll as jest.Mock).mockResolvedValue(mockProducts);

      await productController.getAll(req as Request, res as Response);

      expect(productService.getAll).toHaveBeenCalledWith();
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        mockProducts,
        HTTP_STATUS_CODES.OK,
        "Products retrieved successfully",
      );
    });

    it("should handle errors", async () => {
      const { req, res } = mocks.createMockReqRes();

      (productService.getAll as jest.Mock).mockRejectedValue(
        new Error("Error"),
      );

      await expect(
        productController.getAll(req as Request, res as Response),
      ).rejects.toThrow("Service Error");

      expect(productService.getAll).toHaveBeenCalledWith();
      expect(sendResponse).not.toHaveBeenCalled();
    });
  });

  describe("Get Product By Id", () => {
    it("should get a product by id", async () => {
      const { req, res } = mocks.createMockReqRes({
        params: { id },
      });

      const mockProduct = {
        ...productData,
      };

      (productService.getById as jest.Mock).mockResolvedValue(mockProduct);

      await productController.getById(req as Request, res as Response);

      expect(productService.getById).toHaveBeenCalledWith(req.params?.id);
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        mockProduct,
        HTTP_STATUS_CODES.OK,
        "Product retrieved successfully",
      );
    });

    it("should handle errors", async () => {
      const { req, res } = mocks.createMockReqRes({
        params: { id: "1" },
      });

      (productService.getById as jest.Mock).mockRejectedValue(
        new Error("Error"),
      );

      await expect(
        productController.getById(req as Request, res as Response),
      ).rejects.toThrow("Service Error");

      expect(productService.getById).toHaveBeenCalledWith(req.params?.id);
      expect(sendResponse).not.toHaveBeenCalled();
    });
  });

  describe("Get Products by category", () => {
    it("should get products by category", async () => {
      const { req, res } = mocks.createMockReqRes({
        params: { branchId: "1" },
        query: { category: "Test Category" },
      });

      (productService.getByCategory as jest.Mock).mockResolvedValue(
        mockProducts,
      );

      await productController.getByCategory(req as Request, res as Response);

      expect(productService.getByCategory).toHaveBeenCalledWith({
        branchId: req.params?.branchId,
        category: req.query?.category,
      });
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        mockProducts,
        HTTP_STATUS_CODES.OK,
        "Products retrieved successfully",
      );
    });

    it("should handle errors", async () => {
      const { req, res } = mocks.createMockReqRes({
        query: { category: "Test Category", branchId: "1" },
      });

      (productService.getByCategory as jest.Mock).mockRejectedValue(
        new Error("Error"),
      );

      await expect(
        productController.getByCategory(req as Request, res as Response),
      ).rejects.toThrow("Service Error");

      expect(productService.getByCategory).toHaveBeenCalledWith(req.query);
      expect(sendResponse).not.toHaveBeenCalled();
    });
  });

  describe("Get Product By Branch", () => {
    it("should get products by branch", async () => {
      const { req, res } = mocks.createMockReqRes({
        params: { branchId: "1" },
      });

      (productService.getByBranch as jest.Mock).mockResolvedValue(mockProducts);

      await productController.getByBranch(req as Request, res as Response);

      expect(productService.getByBranch).toHaveBeenCalledWith(
        req.params?.branchId,
      );
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        mockProducts,
        HTTP_STATUS_CODES.OK,
        "Products retrieved successfully",
      );
    });

    it("should handle errors", async () => {
      const { req, res } = mocks.createMockReqRes({
        params: { branchId: "1" },
      });

      (productService.getByBranch as jest.Mock).mockRejectedValue(
        new Error("Error"),
      );

      await expect(
        productController.getByBranch(req as Request, res as Response),
      ).rejects.toThrow("Service Error");

      expect(productService.getByBranch).toHaveBeenCalledWith(
        req.params?.branchId,
      );
      expect(sendResponse).not.toHaveBeenCalled();
    });
  });
});
