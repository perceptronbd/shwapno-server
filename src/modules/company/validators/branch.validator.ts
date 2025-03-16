import { z } from "zod";

const getById = z.object({
  params: z.object({
    branchId: z.string().min(1, "Branch name is required"),
  }),
});

export const validateBranch = {
  getById,
};
