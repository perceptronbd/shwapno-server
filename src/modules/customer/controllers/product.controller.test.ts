import { HTTP_STATUS_CODES } from "@/utils/http-status-codes";
import { productService } from "../services/product.service";
import { sendResponse } from "@/handlers/response.handler";
import { productController } from "./product.controller";
import { productData } from "@/tests/utils/test-data";
import { mocks } from "@/tests/utils/mocks";
import { Request, Response } from "express";

// Mock dependencies
jest.mock("@/handlers/response.handler");
jest.mock("../services/product.service");

const mockProducts = [
  {
    ...productData,
  },
];

describe("Product Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("Get Product By Branch", () => {
    it("should get products by branch", async () => {
      const { req, res } = mocks.createMockReqRes({
        params: { branchId: "1" },
        query: { limit: "10", page: "1" },
      });

      const mockFilteredProducts = mockProducts.map((product) => ({
        imageURL: product.imgURL,
        name: product.name,
        price: product.price,
        category: product.category,
      }));

      (productService.getByBranch as jest.Mock).mockResolvedValue(
        mockFilteredProducts,
      );

      await productController.getByBranch(req as Request, res as Response);

      const limitValue = parseInt(req.query?.limit as string, 10);
      const pageValue = parseInt(req.query?.page as string, 10);

      expect(productService.getByBranch).toHaveBeenCalledWith({
        branchId: req.params?.branchId,
        limit: limitValue,
        page: pageValue,
      });
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        mockFilteredProducts,
        HTTP_STATUS_CODES.OK,
        "Products retrieved successfully",
      );
    });

    it("should handle errors", async () => {
      const { req, res } = mocks.createMockReqRes({
        params: { branchId: "1" },
        query: { limit: "10", page: "1" },
      });

      (productService.getByBranch as jest.Mock).mockRejectedValue(new Error());

      await expect(
        productController.getByBranch(req as Request, res as Response),
      ).rejects.toThrow();

      const limitValue = parseInt(req.query?.limit as string, 10);
      const pageValue = parseInt(req.query?.page as string, 10);

      expect(productService.getByBranch).toHaveBeenCalledWith({
        branchId: req.params?.branchId,
        limit: limitValue,
        page: pageValue,
      });
      expect(sendResponse).not.toHaveBeenCalled();
    });
  });
});
