import { z } from "zod";

const get = z.object({
  params: z.object({
    branchId: z.string(),
  }),
});

const create = z.object({
  body: z.object({
    branchName: z.string().min(1, "Branch name is required"),
  }),
});

export const validateQR = {
  get,
  create,
};
