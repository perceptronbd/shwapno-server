import { z } from "zod";

const getByBranch = z.object({});

const getById = z.object({});

const updateStatus = z.object({});

const remove = z.object({});

export const validateOrder = {
  getByBranch,
  getById,
  updateStatus,
  remove,
};
