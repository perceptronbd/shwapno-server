import { HTTP_STATUS_CODES } from "@/utils/http-status-codes";
import { sendResponse } from "@/handlers/response.handler";
import { branchService } from "../services/branch.service";
import { branchController } from "./branch.controller";
import { Request, Response } from "express";

// Mock dependencies
jest.mock("../services/branch.service");
jest.mock("@/handlers/response.handler");

describe("Branch Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      params: {
        branchName: "TestBranch",
      },
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("getByName", () => {
    it("should get branch by name and send successful response", async () => {
      // Mock data
      const mockBranch = { id: 1, name: "TestBranch", address: "Test Address" };

      // Mock service response
      (branchService.getByName as jest.Mock).mockResolvedValue(mockBranch);

      // Call the controller
      await branchController.getByName(
        mockRequest as Request,
        mockResponse as Response,
      );

      // Assertions
      expect(branchService.getByName).toHaveBeenCalledWith("TestBranch");
      expect(sendResponse).toHaveBeenCalledWith(
        mockResponse,
        mockBranch,
        HTTP_STATUS_CODES.OK,
        "Branch retrieved successfully",
      );
    });

    it("should handle errors when branch service fails", async () => {
      // Mock service error
      const error = new Error("Service error");
      (branchService.getByName as jest.Mock).mockRejectedValue(error);

      // Call the controller
      await expect(
        branchController.getByName(
          mockRequest as Request,
          mockResponse as Response,
        ),
      ).rejects.toThrow("Service error");
    });
  });
});
