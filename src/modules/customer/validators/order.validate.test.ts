import { cartData, customerData } from "@/tests/utils/test-data";
import { validateOrder } from "./order.validate";

const { id: custId, ...customer } = customerData;
const { sessionId, ..._cart } = cartData;

describe("Order Validation", () => {
  describe("Create Order", () => {
    it("should validate a valid request", () => {
      const request = {
        body: {
          sessionId,
          customer,
        },
        params: {
          id: "branch-001",
        },
      };

      expect(() => validateOrder.create.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid request", () => {
      const request = {
        body: {},
      };

      expect(() => validateOrder.create.parse(request)).toThrow();
    });
  });

  describe("Track Order", () => {
    it("should validate a valid request", () => {
      const request = {
        params: { id: custId },
      };

      expect(() => validateOrder.track.parse(request)).not.toThrow();
    });

    it("should throw an error for an invalid request", () => {
      const request = {
        params: {},
      };

      expect(() => validateOrder.track.parse(request)).toThrow();
    });
  });
});
