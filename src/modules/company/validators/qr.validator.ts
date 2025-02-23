import { z } from "zod";

const get = z.object({
  params: z.object({
    branchId: z.string(),
  }),
});

export const validateQR = {
  get,
};
