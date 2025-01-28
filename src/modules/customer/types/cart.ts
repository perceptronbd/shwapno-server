import { Decimal } from "@prisma/client/runtime/library";

export interface ICartCreatePayload {
  productId: string;
  quantity: number;
  sessionId: string;
}
export interface ICartItemPayload {
  cartId: string;
  productId: string;
  quantity: number;
  price: Decimal;
}
