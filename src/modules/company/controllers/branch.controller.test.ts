import { HTTP_STATUS_CODES } from "@/utils/http-status-codes";
import { sendResponse } from "@/handlers/response.handler";
import { branchService } from "../services/branch.service";
import { branchController } from "./branch.controller";
import { mocks } from "@/tests/utils/mocks";
import { Request, Response } from "express";

jest.mock("@/handlers/response.handler");
jest.mock("../services/branch.service");

describe("Branch Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getById", () => {
    it("should return branch data", async () => {
      const branchId = "branch-123";
      const { req, res } = mocks.createMockReqRes({
        params: { branchId },
      });

      (branchService.getById as jest.Mock).mockResolvedValue({
        id: branchId,
        name: "Main Branch",
      });

      await branchController.getById(req as Request, res as Response);

      expect(branchService.getById).toHaveBeenCalledWith(branchId);
      expect(sendResponse).toHaveBeenCalledWith(
        res,
        { id: branchId, name: "Main Branch" },
        HTTP_STATUS_CODES.OK,
        "Branch retrieved successfully",
      );
    });

    it("should handle errors when fetching branch", async () => {
      const branchId = "branch-123";
      const error = new Error("Failed to fetch branch");

      const { req, res } = mocks.createMockReqRes({
        params: { branchId },
      });

      (branchService.getById as jest.Mock).mockRejectedValue(error);

      await expect(
        branchController.getById(req as Request, res as Response),
      ).rejects.toThrow("Failed to fetch branch");

      expect(branchService.getById).toHaveBeenCalledWith(branchId);
      expect(sendResponse).not.toHaveBeenCalled();
    });
  });
});
