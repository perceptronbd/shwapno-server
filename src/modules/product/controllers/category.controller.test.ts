import { categoryController } from "../services/category.service";
import { categoryService } from "../services/category.service";
import { HTTP_STATUS_CODES } from "@utils/http-status-codes";
import { sendResponse } from "@handlers/response.handler";
import { productData } from "@/tests/utils/test-data";
import { mocks } from "@/tests/utils/mocks";
import { Request, Response } from "express";

// Mock dependencies
jest.mock("@handlers/response.handler");
jest.mock("../services/product.service");

describe("Category Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Create Category", () => {
    it("should create a category", async () => {
      const { req, res } = mocks.createMockReqRes({
        body: { name: "category" },
        params: { id: "1" },
      });

      const mockResult = { id: 1, ...req.body };

      (categoryService.create as jest.Mock).mockResolvedValue(mockResult);

      await categoryController.create(req as Request, res as Response);

      expect(categoryService.create).toHaveBeenCalledWith(req.body);
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        mockResult,
        HTTP_STATUS_CODES.CREATED,
        "Category created successfully",
      );
    });

    it("should handle errors", async () => {
      const { req, res } = mocks.createMockReqRes({
        body: { name: "", price: -100, barcode: "" },
      });

      (categoryService.create as jest.Mock).mockRejectedValue(
        new Error("Error"),
      );

      await expect(
        categoryController.create(req as Request, res as Response),
      ).rejects.toThrow("Service Error");

      expect(categoryService.create).toHaveBeenCalledWith(req.body);
    });
  });

  describe("Update Category", () => {
    it("should update a category", async () => {
      const { req, res } = mocks.createMockReqRes({
        body: { name: "category" },
        params: { id: "1" },
      });

      const mockResult = { id: 1, ...req.body };

      (categoryService.update as jest.Mock).mockResolvedValue(mockResult);

      await categoryController.update(req as Request, res as Response);

      expect(categoryService.update).toHaveBeenCalledWith({
        id: req.params?.id,
        categoryData: req.body,
      });
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        mockResult,
        HTTP_STATUS_CODES.OK,
        "Category updated successfully",
      );
    });

    it("should handle errors", async () => {
      const { req, res } = mocks.createMockReqRes({
        body: { name: "", price: -100, barcode: "" },
      });

      (categoryService.update as jest.Mock).mockRejectedValue(
        new Error("Error"),
      );

      await expect(
        categoryController.update(req as Request, res as Response),
      ).rejects.toThrow("Service Error");

      expect(categoryService.update).toHaveBeenCalledWith({
        id: req.params?.id,
        categoryData: req.body,
      });
    });
  });

  describe("Delete Category", () => {
    it("should delete a category", async () => {
      const { req, res } = mocks.createMockReqRes({
        params: { id: "1" },
      });

      (categoryService.remove as jest.Mock).mockResolvedValue(null);

      await categoryController.remove(req as Request, res as Response);

      expect(categoryService.remove).toHaveBeenCalledWith({ id: "1" });
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        null,
        HTTP_STATUS_CODES.OK,
        "Category deleted successfully",
      );
    });

    it("should handle errors", async () => {
      const { req, res } = mocks.createMockReqRes({
        params: { id: "1" },
      });

      (categoryService.remove as jest.Mock).mockRejectedValue(
        new Error("Error"),
      );

      await expect(
        categoryController.remove(req as Request, res as Response),
      ).rejects.toThrow("Service Error");

      expect(categoryService.remove).toHaveBeenCalledWith({ id: "1" });
    });
  });

  describe("Get All Categories", () => {
    it("should get all categories", async () => {
      const { req, res } = mocks.createMockReqRes();

      (categoryService.getAll as jest.Mock).mockResolvedValue([productData]);

      await categoryController.getAll(req as Request, res as Response);

      expect(categoryService.getAll).toHaveBeenCalled();
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        [productData],
        HTTP_STATUS_CODES.OK,
        "Categories retrieved successfully",
      );
    });

    it("should handle errors", async () => {
      const { req, res } = mocks.createMockReqRes();

      (categoryService.getAll as jest.Mock).mockRejectedValue(
        new Error("Error"),
      );

      await expect(
        categoryController.getAll(req as Request, res as Response),
      ).rejects.toThrow("Service Error");

      expect(categoryService.getAll).toHaveBeenCalled();
    });
  });

  describe("Get Category By Id", () => {
    it("should get a category by id", async () => {
      const { req, res } = mocks.createMockReqRes({
        params: { id: "1" },
      });

      (categoryService.getById as jest.Mock).mockResolvedValue(productData);

      await categoryController.getById(req as Request, res as Response);

      expect(categoryService.getById).toHaveBeenCalledWith("1");
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        productData,
        HTTP_STATUS_CODES.OK,
        "Category retrieved successfully",
      );
    });

    it("should handle errors", async () => {
      const { req, res } = mocks.createMockReqRes({
        params: { id: "1" },
      });

      (categoryService.getById as jest.Mock).mockRejectedValue(
        new Error("Error"),
      );

      await expect(
        categoryController.getById(req as Request, res as Response),
      ).rejects.toThrow("Service Error");

      expect(categoryService.getById).toHaveBeenCalledWith("1");
    });
  });

  describe("Get Categories by branch", () => {
    it("should get categories by branch", async () => {
      const { req, res } = mocks.createMockReqRes({
        params: { id: "1" },
      });

      (categoryService.getByBranch as jest.Mock).mockResolvedValue([
        productData,
      ]);

      await categoryController.getByBranch(req as Request, res as Response);

      expect(categoryService.getByBranch).toHaveBeenCalledWith("1");
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        [productData],
        HTTP_STATUS_CODES.OK,
        "Categories retrieved successfully",
      );
    });

    it("should handle errors", async () => {
      const { req, res } = mocks.createMockReqRes({
        params: { id: "1" },
      });

      (categoryService.getByBranch as jest.Mock).mockRejectedValue(
        new Error("Error"),
      );

      await expect(
        categoryController.getByBranch(req as Request, res as Response),
      ).rejects.toThrow("Service Error");

      expect(categoryService.getByBranch).toHaveBeenCalledWith("1");
    });
  });
});
