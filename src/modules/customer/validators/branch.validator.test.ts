import { validateBranch } from "./branch.validator";

describe("Branch Validator", () => {
  describe("getByName", () => {
    it("should validate valid branch name in params", () => {
      // Valid input
      const validInput = {
        params: {
          branchName: "TestBranch",
        },
      };

      // Parse the input
      const result = validateBranch.getByName.safeParse(validInput);

      // Assertions
      expect(result.success).toBe(true);
    });

    it("should reject empty branch name in params", () => {
      // Invalid input - empty branch name
      const invalidInput = {
        params: {
          branchName: "",
        },
      };

      // Parse the input
      const result = validateBranch.getByName.safeParse(invalidInput);

      // Assertions
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe("Branch name is required");
      }
    });

    it("should reject missing branch name in params", () => {
      // Invalid input - missing branch name
      const invalidInput = {
        params: {},
      };

      // Parse the input
      const result = validateBranch.getByName.safeParse(invalidInput);

      // Assertions
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain("branchName");
      }
    });

    it("should reject non-string branch name in params", () => {
      // Invalid input - non-string branch name
      const invalidInput = {
        params: {
          branchName: 123,
        },
      };

      // Parse the input
      const result = validateBranch.getByName.safeParse(invalidInput);

      // Assertions
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].code).toBe("invalid_type");
      }
    });
  });
});
