import { OrderStatus } from "@prisma/client";
import { z } from "zod";

const getAll = z.object({
  query: z.object({
    page: z.coerce.number().optional().default(1),
    limit: z.coerce.number().optional().default(10),
  }),
});

const getByBranch = z.object({
  params: z.object({
    branchId: z.string().uuid(),
  }),
  query: z.object({
    page: z.coerce.number().optional().default(1),
    limit: z.coerce.number().optional().default(10),
  }),
});

const getById = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

const updateStatus = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    status: z.nativeEnum(OrderStatus),
  }),
});

const remove = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const validateOrder = {
  getAll,
  getByBranch,
  getById,
  updateStatus,
  remove,
};

export type TGetAllOrder = z.infer<typeof getAll>["query"] & {
  userId: string;
};
export type TGetByBranchOrder = z.infer<typeof getByBranch>["query"] &
  z.infer<typeof getByBranch>["params"];
export type TGetByIdOrder = z.infer<typeof getById>["params"];
export type TUpdateStatusOrder = z.infer<typeof updateStatus>["params"] &
  z.infer<typeof updateStatus>["body"];
export type TRemoveOrder = z.infer<typeof remove>["params"];
