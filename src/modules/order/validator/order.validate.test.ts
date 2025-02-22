import { validateOrder } from "./order.validate";

describe("Product Validator", () => {
  describe("Get Products By Branch", () => {
    it("should validate a valid request", () => {
      const request = {
        params: { branchId: "123e4567-e89b-12d3-a456-426614174000" },
        query: { page: 1, limit: 10 },
      };

      expect(() => validateOrder.getByBranch.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid request", () => {
      const request = {
        params: { branchId: null },
      };

      expect(() => validateOrder.getByBranch.parse(request)).toThrow();
    });
  });

  describe("Get Product By Id", () => {
    it("should validate a valid request", () => {
      const request = {
        params: { id: "123e4567-e89b-12d3-a456-426614174000" },
      };

      expect(() => validateOrder.getById.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid request", () => {
      const request = {
        params: { id: null },
      };

      expect(() => validateOrder.getById.parse(request)).toThrow();
    });
  });

  describe("Update Product Status", () => {
    it("should validate a valid request", () => {
      const request = {
        params: { id: "123e4567-e89b-12d3-a456-426614174000" },
        body: { status: "COMPLETED" },
      };

      expect(() => validateOrder.updateStatus.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid request", () => {
      const request = {
        params: { id: null },
        body: { status: "completed" },
      };

      expect(() => validateOrder.updateStatus.parse(request)).toThrow();
    });
  });

  describe("Remove Product", () => {
    it("should validate a valid request", () => {
      const request = {
        params: { id: "123e4567-e89b-12d3-a456-426614174000" },
      };

      expect(() => validateOrder.remove.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid request", () => {
      const request = {
        params: { id: null },
      };

      expect(() => validateOrder.remove.parse(request)).toThrow();
    });
  });
});
