import { validateCart } from "./cart.validate";

describe("Cart Validation with Zod", () => {
  describe("Add Product to Cart", () => {
    it("should validate a valid request for create cart", () => {
      const request = {
        body: {
          productId: "1",
          quantity: 2,
        },
      };

      expect(() => validateCart.create.parse(request)).not.toThrow();
    });

    it("should validate a valid request for update cart", () => {
      const request = {
        body: {
          sessionId: "1",
          productId: "1",
          quantity: 2,
        },
      };

      expect(() => validateCart.create.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid request", () => {
      const request = {
        body: {},
      };

      expect(() => validateCart.create.parse(request)).toThrow();
    });
  });

  describe("Update Product in Cart", () => {
    it("should validate a valid request", () => {
      const request = {
        body: {
          items: [{ productId: "1", quantity: 2 }],
        },
        params: { id: "1" },
      };

      expect(() => validateCart.updateMany.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid request", () => {
      const request = {
        body: {
          items: [{ productId: "", quantity: -3 }],
        },
        params: { id: "1" },
      };

      expect(() => validateCart.updateMany.parse(request)).toThrow();
    });
  });

  describe("Get Cart", () => {
    it("should validate a valid request", () => {
      const request = {
        params: { id: "1" },
      };

      expect(() => validateCart.remove.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid request", () => {
      const request = {
        params: { id: "invalid" },
      };

      expect(() => validateCart.remove.parse(request)).toThrow();
    });
  });
});
