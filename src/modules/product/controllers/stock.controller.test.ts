import { HTTP_STATUS_CODES } from "@utils/http-status-codes";
import { jobStatusService } from "../services/job.service";
import { sendResponse } from "@handlers/response.handler";
import { stockService } from "../services/stock.service";
import { stockController } from "./stock.controller";
import { stockData } from "@/tests/utils/test-data";
import { mocks } from "@/tests/utils/mocks";
import { Request, Response } from "express";
import { Readable } from "stream";

// Mock dependencies
jest.mock("@handlers/response.handler");
jest.mock("../services/stock.service");
jest.mock("../services/job.service");
jest.mock("fs", () => ({
  readFileSync: jest.fn().mockImplementation(() => Buffer.from("test data")),
  existsSync: jest.fn().mockReturnValue(true),
  unlinkSync: jest.fn(),
}));

describe("Stock Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Upload Excel", () => {
    it("should handle file upload and start processing", async () => {
      // Create a readable stream for the mock file
      const buffer = Buffer.from("test data");
      const stream = new Readable();
      stream.push(buffer);
      stream.push(null);

      const mockFile = {
        buffer: buffer,
        originalname: "test.xlsx",
        fieldname: "file",
        encoding: "7bit",
        mimetype:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: 100,
        destination: "",
        filename: "",
        path: "temp/test.xlsx",
        stream: stream,
      };

      const { req, res } = mocks.createMockReqRes({
        params: { branchId: "1" },
        file: mockFile,
      });

      const mockResult = {
        processed: 0,
        created: 0,
        updated: 0,
        errors: [],
      };

      // Mock job creation
      const mockJob = {
        id: "test-job-id",
        status: "pending",
        progress: 0,
        processed: 0,
        total: 0,
        errors: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (jobStatusService.create as jest.Mock).mockResolvedValue(mockJob);
      (stockService.processExcelUpload as jest.Mock).mockResolvedValue(
        mockResult,
      );

      await stockController.uploadExcel(req as Request, res as Response);

      // Check that the job was created
      expect(jobStatusService.create).toHaveBeenCalled();

      // Check that the initial response was sent with the job object
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        mockJob,
        HTTP_STATUS_CODES.ACCEPTED,
        "Processing started",
      );

      // Use setTimeout to allow the async processing to complete
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Now check that the service was called with the right parameters
      expect(stockService.processExcelUpload).toHaveBeenCalledWith({
        branchId: "1",
        jobId: mockJob.id,
        fileBuffer: expect.any(Buffer),
      });
    });

    it("should handle missing file error", async () => {
      const { req, res } = mocks.createMockReqRes({
        params: { branchId: "1" },
        file: undefined,
      });

      await stockController.uploadExcel(req as Request, res as Response);

      expect(sendResponse).toHaveBeenCalledWith(
        res,
        null,
        HTTP_STATUS_CODES.BAD_REQUEST,
        "No file uploaded",
      );
    });

    it("should handle processing error", async () => {
      // Create a readable stream for the mock file
      const buffer = Buffer.from("test data");
      const stream = new Readable();
      stream.push(buffer);
      stream.push(null);

      const mockFile = {
        buffer: buffer,
        originalname: "test.xlsx",
        fieldname: "file",
        encoding: "7bit",
        mimetype:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: 100,
        destination: "",
        filename: "",
        path: "temp/test.xlsx",
        stream: stream,
      };

      const { req, res } = mocks.createMockReqRes({
        params: { branchId: "1" },
        file: mockFile,
      });

      // Mock job creation
      const mockJob = {
        id: "test-job-id",
        status: "pending",
        progress: 0,
        processed: 0,
        total: 0,
        errors: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (jobStatusService.create as jest.Mock).mockResolvedValue(mockJob);

      // Mock the error that will be thrown during processing
      const mockError = new Error("Processing failed");
      (stockService.processExcelUpload as jest.Mock).mockRejectedValue(
        mockError,
      );

      // Mock console.error to prevent actual error output during tests
      const originalConsoleError = console.error;
      console.error = jest.fn();
      const originalConsoleLog = console.log;
      console.log = jest.fn();

      // Call the controller method
      await stockController.uploadExcel(req as Request, res as Response);

      // Check that the initial response was sent correctly
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        mockJob,
        HTTP_STATUS_CODES.ACCEPTED,
        "Processing started",
      );

      // Wait for the setTimeout to execute
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Verify that processExcelUpload was called
      expect(stockService.processExcelUpload).toHaveBeenCalled();

      // Restore console functions
      console.error = originalConsoleError;
      console.log = originalConsoleLog;
    });
  });

  describe("Get Upload Status", () => {
    it("should get job status", async () => {
      const { req, res } = mocks.createMockReqRes({
        params: { jobId: "test-job-id" },
      });

      const mockJob = {
        id: "test-job-id",
        status: "completed",
        progress: 100,
        processed: 10,
        total: 10,
        errors: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (jobStatusService.get as jest.Mock).mockResolvedValue(mockJob);

      await stockController.getUploadStatus(req as Request, res as Response);

      expect(jobStatusService.get).toHaveBeenCalledWith("test-job-id");
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        mockJob,
        HTTP_STATUS_CODES.OK,
        "Job status retrieved",
      );
    });

    it("should handle job not found", async () => {
      const { req, res } = mocks.createMockReqRes({
        params: { jobId: "non-existent-id" },
      });

      (jobStatusService.get as jest.Mock).mockResolvedValue(null);

      await stockController.getUploadStatus(req as Request, res as Response);

      expect(jobStatusService.get).toHaveBeenCalledWith("non-existent-id");
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        null,
        HTTP_STATUS_CODES.NOT_FOUND,
        "Job not found",
      );
    });
  });

  describe("Add Stock", () => {
    it("should add a stock", async () => {
      const { id, branchId, ...stock } = stockData;

      const { req, res } = mocks.createMockReqRes({
        body: stock,
        params: { branchId },
      });

      const mockResult = { ...stockData };

      (stockService.add as jest.Mock).mockResolvedValue(mockResult);

      await stockController.add(req as Request, res as Response);

      expect(stockService.add).toHaveBeenCalledWith({
        branchId,
        data: req.body,
      });
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        mockResult,
        HTTP_STATUS_CODES.OK,
        "Stock added successfully",
      );
    });

    it("should handle errors", async () => {
      const { req, res } = mocks.createMockReqRes({
        body: { quantity: -10, productId: 1 },
        params: { branchId: "1" },
      });

      (stockService.add as jest.Mock).mockRejectedValue(new Error());

      await expect(
        stockController.add(req as Request, res as Response),
      ).rejects.toThrow();

      expect(sendResponse).not.toHaveBeenCalled();
    });
  });

  // Rest of the test cases remain unchanged
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

      const mockResult = {
        data: [stockData],
        meta: { total: 1, page: 1, limit: 10 },
      };

      (stockService.getByBranch as jest.Mock).mockResolvedValue(mockResult);

      await stockController.getByBranch(req as Request, res as Response);

      // Fix: Controller calls with two parameters: branchId and query object
      expect(stockService.getByBranch).toHaveBeenCalledWith("1", {});
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        [stockData], // This should be the data property
        HTTP_STATUS_CODES.OK,
        "Stocks retrieved successfully",
        { total: 1, page: 1, limit: 10 }, // This should be the meta property
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

      // Fix: Controller calls with two parameters: branchId and query object
      expect(stockService.getByBranch).toHaveBeenCalledWith("1", {});
    });
  });
});
