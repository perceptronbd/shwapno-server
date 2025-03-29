import { z } from "zod";

const branchId = z.string({ invalid_type_error: "Invalid ID format" });

const getByBranch = z.object({
  query: z.object({
    page: z
      .number()
      .int()
      .positive("Page must be a positive integer")
      .default(1), // Default to 1 if not provided
    limit: z
      .number()
      .int()
      .positive("Limit must be a positive integer")
      .default(10), // Default to 10 if not provided
  }),
  params: z.object({
    branchId: branchId, // Assuming branchId is defined
  }),
});

export const validateProduct = {
  getByBranch,
};

export type TGetProductByBranch = z.infer<typeof getByBranch>["query"] &
  z.infer<typeof getByBranch>["params"];
