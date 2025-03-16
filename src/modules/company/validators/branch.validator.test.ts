import { validateBranch } from "./branch.validator";

describe("Branch Validator", () => {
  describe("Get Branch by ID", () => {
    it("should validate valid request", () => {
      const req = {
        params: { branchId: "branch-123" },
      };
      expect(() => validateBranch.getById.parse(req)).not.toThrow();
    });

    it("should reject invalid request with empty ID", () => {
      const req = {
        params: { branchId: "" },
      };
      expect(() => validateBranch.getById.parse(req)).toThrow();
    });

    it("should reject invalid request with missing ID", () => {
      const req = {
        params: {},
      };
      expect(() => validateBranch.getById.parse(req)).toThrow();
    });

    it("should reject invalid request with null ID", () => {
      const req = {
        params: { branchId: null },
      };
      expect(() => validateBranch.getById.parse(req)).toThrow();
    });
  });
});
