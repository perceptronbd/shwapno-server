import { validateBranch } from "./branch.validator";

describe("Branch Validator", () => {
  describe("Get Branch by Name", () => {
    it("should validate valid request", () => {
      const req = {
        params: { name: "Main Branch" },
      };
      expect(() => validateBranch.getByName.parse(req)).not.toThrow();
    });

    it("should reject invalid request", () => {
      const req = {
        params: { name: "" },
      };
      expect(() => validateBranch.getByName.parse(req)).toThrow();
    });
  });
});
