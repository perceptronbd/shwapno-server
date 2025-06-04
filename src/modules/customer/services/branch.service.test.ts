import { branchModel } from "../models/branch.model";
import { branchService } from "./branch.service";

// Mock dependencies
jest.mock("../models/branch.model");

describe("Branch Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getByName", () => {
    it("should call branchModel.getByName with correct parameters", async () => {
      // Mock data
      const branchName = "TestBranch";
      const mockBranch = { id: 1, name: "TestBranch", address: "Test Address" };

      // Mock model response
      (branchModel.getByName as jest.Mock).mockResolvedValue(mockBranch);

      // Call the service
      const result = await branchService.getByName(branchName);

      // Assertions
      expect(branchModel.getByName).toHaveBeenCalledWith(branchName);
      expect(result).toEqual(mockBranch);
    });

    it("should handle errors from the model", async () => {
      // Mock model error
      const error = new Error("Database error");
      (branchModel.getByName as jest.Mock).mockRejectedValue(error);

      // Call the service and expect it to throw
      await expect(branchService.getByName("TestBranch")).rejects.toThrow(
        "Database error",
      );
    });
  });
});
