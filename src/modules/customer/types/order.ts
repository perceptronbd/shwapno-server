import { TCreateOrderRequest } from "../validators/order.validate";

export type TOrderPayload = TCreateOrderRequest & {
  branchId: string;
};
