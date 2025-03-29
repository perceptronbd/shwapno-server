import { validateProduct } from "./product.validate";

describe("Product Validator", () => {
  describe("Get Products By Branch", () => {
    it("should validate a valid request", () => {
      const request = {
        params: { branchId: "1" },
        query: { page: 1, limit: 10 },
      };

      expect(() => validateProduct.getByBranch.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid request", () => {
      const request = {
        params: { branchId: null },
      };

      expect(() => validateProduct.getByBranch.parse(request)).toThrow();
    });
  });
});
