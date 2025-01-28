import { z } from "zod";

const add = z.object({
  body: z.object({
    productId: z.string().min(1, "Product ID is required"),
    quantity: z.number().int().positive("Quantity must be a positive integer"),
    sessionId: z.string().optional(),
  }),
});

const update = {};

const remove = {};

const get = {};

// export types
export type TAddCartRequest = z.infer<typeof add>["body"];

export const validateCart = {
  add,
  update,
  remove,
  get,
};
