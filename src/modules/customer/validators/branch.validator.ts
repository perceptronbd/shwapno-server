import { z } from "zod";

const getByName = z.object({
  params: z.object({
    branchName: z.string().min(1, "Branch name is required"),
  }),
});

export const validateBranch = {
  getByName,
};
