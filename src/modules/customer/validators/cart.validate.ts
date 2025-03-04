import { z } from "zod";
// Schema for request parameters (cart ID)
export const cartId = z.object({
  id: z.string().min(1, "Cart ID is required"),
});

const productId = z.string().min(1, "Product ID is required");
const quantity = z
  .number()
  .int()
  .positive("Quantity must be a positive integer");
const sessionId = z.string().optional();

const cartSchema = {
  productId: productId,
  quantity: quantity,
  sessionId: sessionId,
};
// Schema for a single cart item
const cartItemSchema = z.object({
  productId,
  quantity,
});

const cartUpdateSchema = z.object({
  ...cartSchema,
  sessionId: z.string().min(1, "Session ID is required"),
});

const create = z.object({
  body: z.object(cartSchema),
});

const updateOne = z.object({
  body: cartUpdateSchema,
});

// Combined schema for validation (optional: if needed together)
export const updateMany = z.object({
  body: z.object({
    items: z.array(cartItemSchema).min(1, "At least one item must be provided"),
  }),
  params: cartId,
});

const deleteItem = z.object({
  body: z.object({ productId }),
  params: cartId,
});

const get = z.object({
  params: cartId,
});

// export types
export type TAddCartRequest = z.infer<typeof create>["body"];
export type TUpdateOneCartRequest = z.infer<typeof updateOne>["body"];
export type TUpdateManyCartRequest = z.infer<typeof updateMany>["body"] & {
  sessionId: string;
};

export const validateCart = {
  create,
  updateOne,
  updateMany,
  deleteItem,
  get,
};
