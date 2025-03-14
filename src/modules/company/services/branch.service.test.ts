import { branchModel } from "../models/branch.model";
import { branchService } from "./branch.service";

jest.mock("../models/branch.model");

describe("Branch Service", () => {
  describe("getByName", () => {
    it("should return branch data", async () => {
      (branchModel.getByName as jest.Mock).mockResolvedValue({
        id: 1,
        name: "Main Branch",
      });
      const result = await branchService.getByName("Main Branch");
      expect(result).toEqual({ id: 1, name: "Main Branch" });
    });

    it("should handle errors", async () => {
      (branchModel.getByName as jest.Mock).mockRejectedValue(
        new Error("Database error"),
      );
      await expect(branchService.getByName("Main Branch")).rejects.toThrow(
        "Database error",
      );
    });
  });
});
