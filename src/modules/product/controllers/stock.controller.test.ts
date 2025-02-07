import { HTTP_STATUS_CODES } from "@utils/http-status-codes";
import { sendResponse } from "@handlers/response.handler";
import { stockService } from "../services/stock.service";
import { stockController } from "./stock.controller";
import { stockData } from "@/tests/utils/test-data";
import { mocks } from "@/tests/utils/mocks";
import { Request, Response } from "express";

// Mock dependencies
jest.mock("@handlers/response.handler");
jest.mock("../services/stock.service");

describe("Stock Controller", () => {
  describe("Create Stock", () => {
    it("should create a stock", async () => {
      const { id, ...stock } = stockData;

      const { req, res } = mocks.createMockReqRes({
        body: stock,
      });

      const mockResult = { ...stockData };

      (stockService.create as jest.Mock).mockResolvedValue(mockResult);

      await stockController.create(req as Request, res as Response);

      expect(stockService.create).toHaveBeenCalledWith(req.body);
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        mockResult,
        HTTP_STATUS_CODES.CREATED,
        "Stock created successfully",
      );
    });

    it("should handle errors", async () => {
      const { req, res } = mocks.createMockReqRes({
        body: { quantity: -10, productId: 1 },
      });

      (stockService.create as jest.Mock).mockRejectedValue(new Error());

      await expect(
        stockController.create(req as Request, res as Response),
      ).rejects.toThrow();

      expect(stockService.create).toHaveBeenCalledWith(req.body);
    });
  });

  describe("Update Stock", () => {
    it("should update a stock", async () => {
      const { id, ...stock } = stockData;

      const { req, res } = mocks.createMockReqRes({
        body: stock,
        params: { id: "1" },
      });

      const mockResult = { ...stockData };

      (stockService.update as jest.Mock).mockResolvedValue(mockResult);

      await stockController.update(req as Request, res as Response);

      expect(stockService.update).toHaveBeenCalledWith({
        id: req.params?.id,
        stock: req.body,
      });
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        mockResult,
        HTTP_STATUS_CODES.OK,
        "Stock updated successfully",
      );
    });

    it("should handle errors", async () => {
      const { req, res } = mocks.createMockReqRes({
        body: { quantity: -10, productId: 1 },
        params: { id: "1" },
      });

      (stockService.update as jest.Mock).mockRejectedValue(new Error());

      await expect(
        stockController.update(req as Request, res as Response),
      ).rejects.toThrow();

      expect(stockService.update).toHaveBeenCalledWith({
        id: req.params?.id,
        stock: req.body,
      });
    });
  });

  describe("Delete Stock", () => {
    it("should delete a stock", async () => {
      const { req, res } = mocks.createMockReqRes({
        params: { id: "1" },
      });

      const mockResult = { id: "1" };

      (stockService.remove as jest.Mock).mockResolvedValue(mockResult);

      await stockController.remove(req as Request, res as Response);

      expect(stockService.remove).toHaveBeenCalledWith({ id: req.params?.id });
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        mockResult,
        HTTP_STATUS_CODES.OK,
        "Stock deleted successfully",
      );
    });

    it("should handle errors", async () => {
      const { req, res } = mocks.createMockReqRes({
        params: { id: "1" },
      });

      (stockService.remove as jest.Mock).mockRejectedValue(new Error());

      await expect(
        stockController.remove(req as Request, res as Response),
      ).rejects.toThrow();

      expect(stockService.remove).toHaveBeenCalledWith({ id: req.params?.id });
    });
  });

  describe("Get All Stock (by company)", () => {
    it("should get a stock", async () => {
      const { req, res } = mocks.createMockReqRes({
        params: { id: "1" },
      });

      const mockResult = { ...stockData };

      (stockService.getAll as jest.Mock).mockResolvedValue(mockResult);

      await stockController.getAll(req as Request, res as Response);

      expect(stockService.getAll).toHaveBeenCalledWith({
        id: req.params?.id,
      });
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        mockResult,
        HTTP_STATUS_CODES.OK,
        "Stocks retrieved successfully",
      );
    });

    it("should handle errors", async () => {
      const { req, res } = mocks.createMockReqRes({
        params: { id: "1" },
      });

      (stockService.getAll as jest.Mock).mockRejectedValue(new Error());

      await expect(
        stockController.getAll(req as Request, res as Response),
      ).rejects.toThrow();

      expect(stockService.getAll).toHaveBeenCalledWith({ id: req.params?.id });
    });
  });

  describe("Get Stock By Id", () => {
    it("should get a stock by id", async () => {
      const { req, res } = mocks.createMockReqRes({
        params: { id: "1" },
      });

      const mockResult = { ...stockData };

      (stockService.getById as jest.Mock).mockResolvedValue(mockResult);

      await stockController.getById(req as Request, res as Response);

      expect(stockService.getById).toHaveBeenCalledWith({ id: req.params?.id });
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        mockResult,
        HTTP_STATUS_CODES.OK,
        "Stock retrieved successfully",
      );
    });

    it("should handle errors", async () => {
      const { req, res } = mocks.createMockReqRes({
        params: { id: "1" },
      });

      (stockService.getById as jest.Mock).mockRejectedValue(new Error());

      await expect(
        stockController.getById(req as Request, res as Response),
      ).rejects.toThrow();

      expect(stockService.getById).toHaveBeenCalledWith({ id: req.params?.id });
    });
  });

  describe("Get Stock By Branch", () => {
    it("should get stock by branch", async () => {
      const { req, res } = mocks.createMockReqRes({
        params: { branchId: "1" },
      });

      const mockResult = { ...stockData };

      (stockService.getByBranch as jest.Mock).mockResolvedValue(mockResult);

      await stockController.getByBranch(req as Request, res as Response);

      expect(stockService.getByBranch).toHaveBeenCalledWith({
        branchId: req.params?.branchId,
      });
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        mockResult,
        HTTP_STATUS_CODES.OK,
        "Stocks retrieved successfully",
      );
    });

    it("should handle errors", async () => {
      const { req, res } = mocks.createMockReqRes({
        params: { branchId: "1" },
      });

      (stockService.getByBranch as jest.Mock).mockRejectedValue(new Error());

      await expect(
        stockController.getByBranch(req as Request, res as Response),
      ).rejects.toThrow();

      expect(stockService.getByBranch).toHaveBeenCalledWith({
        branchId: req.params?.branchId,
      });
    });
  });
});
