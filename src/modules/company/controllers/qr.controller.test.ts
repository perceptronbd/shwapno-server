import { HTTP_STATUS_CODES } from "@/utils/http-status-codes";
import { sendResponse } from "@/handlers/response.handler";
import { QRService } from "../services/qr.service";
import { QRcontroller } from "./qr.controller";
import { mocks } from "@/tests/utils/mocks";
import { Request, Response } from "express";

jest.mock("@/handlers/response.handler");
jest.mock("../services/qr.service");

describe("QR Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("get", () => {
    // This test remains unchanged as the get method hasn't changed
    it("should fetch QR code by branch ID", async () => {
      const branchId = "branch-123";
      const mockQRURL = { qrURL: "data:image/png;base64,abc123" };

      const { req, res } = mocks.createMockReqRes({
        params: { branchId },
      });

      (QRService.get as jest.Mock).mockResolvedValue(mockQRURL);

      await QRcontroller.get(req as Request, res as Response);

      expect(QRService.get).toHaveBeenCalledWith(branchId);
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        mockQRURL,
        HTTP_STATUS_CODES.OK,
        "QR code fetched successfully",
      );
    });

    it("should handle errors when fetching QR code", async () => {
      const branchId = "branch-123";
      const error = new Error("Failed to fetch QR code");

      const { req, res } = mocks.createMockReqRes({
        params: { branchId },
      });

      (QRService.get as jest.Mock).mockRejectedValue(error);

      await expect(
        QRcontroller.get(req as Request, res as Response),
      ).rejects.toThrow("Failed to fetch QR code");

      expect(QRService.get).toHaveBeenCalledWith(branchId);
      expect(sendResponse).not.toHaveBeenCalled();
    });
  });

  describe("create", () => {
    it("should create QR code for a branch", async () => {
      const branchId = "branch-123";
      const mockQRURL = {
        id: branchId,
        name: "Main Branch",
        qrURL: "data:image/png;base64,abc123",
      };

      const { req, res } = mocks.createMockReqRes({
        params: { branchId },
      });

      (QRService.generate as jest.Mock).mockResolvedValue(mockQRURL);

      await QRcontroller.create(req as Request, res as Response);

      expect(QRService.generate).toHaveBeenCalledWith({ branchId });
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        mockQRURL,
        HTTP_STATUS_CODES.CREATED,
        "QR code created successfully",
      );
    });

    it("should handle errors when creating QR code", async () => {
      const branchId = "branch-123";
      const error = new Error("Failed to create QR code");

      const { req, res } = mocks.createMockReqRes({
        params: { branchId },
      });

      (QRService.generate as jest.Mock).mockRejectedValue(error);

      await expect(
        QRcontroller.create(req as Request, res as Response),
      ).rejects.toThrow("Failed to create QR code");

      expect(QRService.generate).toHaveBeenCalledWith({ branchId });
      expect(sendResponse).not.toHaveBeenCalled();
    });
  });
});
