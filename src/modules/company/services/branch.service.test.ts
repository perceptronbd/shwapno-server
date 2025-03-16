import { branchModel } from "../models/branch.model";
import { branchService } from "./branch.service";

jest.mock("../models/branch.model");

describe("Branch Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getById", () => {
    it("should return branch data", async () => {
      const branchId = "branch-123";
      const mockBranch = {
        id: branchId,
        name: "Main Branch",
      };

      (branchModel.getById as jest.Mock).mockResolvedValue(mockBranch);

      const result = await branchService.getById(branchId);

      expect(branchModel.getById).toHaveBeenCalledWith(branchId);
      expect(result).toEqual(mockBranch);
    });

    it("should handle errors", async () => {
      const branchId = "branch-123";
      const error = new Error("Database error");

      (branchModel.getById as jest.Mock).mockRejectedValue(error);

      await expect(branchService.getById(branchId)).rejects.toThrow(
        "Database error",
      );

      expect(branchModel.getById).toHaveBeenCalledWith(branchId);
    });
  });
});
