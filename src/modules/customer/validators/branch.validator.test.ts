import { validateBranch } from "./branch.validator";

describe("Branch Validator", () => {
  describe("getByName", () => {
    it("should validate valid branch name in params", () => {
      // Valid input
      const validInput = {
        params: {
          name: "TestBranch", // Changed from branchName to name to match validator
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
          name: "",
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
        expect(result.error.issues[0].message).toBe("Required");
        expect(result.error.issues[0].path).toEqual(["params", "name"]);
      }
    });

    it("should reject non-string branch name in params", () => {
      // Invalid input - non-string branch name
      const invalidInput = {
        params: {
          name: 123, // Changed from branchName to name
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
