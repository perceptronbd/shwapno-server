import { validateCategory } from "./category.validator";

describe("Category Validator", () => {
  describe("Create Category", () => {
    it("should validate a valid request", () => {
      const request = {
        body: {
          name: "Test Category",
        },
      };

      expect(() => validateCategory.create.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid request", () => {
      const request = {
        body: {},
      };

      expect(() => validateCategory.create.parse(request)).toThrow();
    });
  });

  describe("Update Category", () => {
    it("should validate a valid request", () => {
      const request = {
        body: {
          name: "Test Category",
        },
        params: { id: "1" },
      };

      expect(() => validateCategory.update.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid request", () => {
      const request = {
        body: {},
        params: { id: "1" },
      };

      expect(() => validateCategory.update.parse(request)).toThrow();
    });
  });

  describe("Delete Category", () => {
    it("should validate a valid request", () => {
      const request = {
        params: { id: "1" },
      };

      expect(() => validateCategory.remove.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid request", () => {
      const request = {
        params: { id: null },
      };

      expect(() => validateCategory.remove.parse(request)).toThrow();
    });
  });

  describe("Get All Categories", () => {
    it("should validate a valid request", () => {
      const request = {};

      expect(() => validateCategory.getAll.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid request", () => {
      const request = {
        query: { page: "invalid" },
      };

      expect(() => validateCategory.getAll.parse(request)).toThrow();
    });
  });

  describe("Get Category By Id", () => {
    it("should validate a valid request", () => {
      const request = {
        params: { id: "1" },
      };

      expect(() => validateCategory.getById.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid request", () => {
      const request = {
        params: { id: null },
      };

      expect(() => validateCategory.getById.parse(request)).toThrow();
    });
  });

  describe("Get Categories By Branch", () => {
    it("should validate a valid request", () => {
      const request = {
        query: { branchId: "1" },
      };

      expect(() => validateCategory.getByBranch.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid request", () => {
      const request = {
        query: { branchId: null },
      };

      expect(() => validateCategory.getByBranch.parse(request)).toThrow();
    });
  });
});
