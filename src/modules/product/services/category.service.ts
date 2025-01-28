import {
  TCreateCategory,
  TUpdateCategory,
} from "../validators/category.validator";
import { categoryModels } from "../models/category.model";
import prisma from "@/config/db.config";

const create = async (data: TCreateCategory) => {
  const createdCategory = await prisma.category.create({
    data,
  });
  return createdCategory;
};

const update = async ({
  id,
  category,
}: {
  id: string;
  category: TUpdateCategory;
}) => {
  const result = await prisma.category.update({
    where: { id },
    data: { ...category, id },
  });
  return result;
};
const remove = async ({ id }: { id: string }) => {
  return await prisma.category.delete({
    where: { id },
  });
};

const getAll = async () => {
  const result = await categoryModels.getAllCategories();
  return result;
};

const getById = async (id: string) => {
  const result = await categoryModels.findCategoryById(id);
  return result;
};

const getByBranch = async ({ branchId }: { branchId: string }) => {
  const result = await categoryModels.findCategoriesByBranch(branchId);
  return result;
};

export const categoryService = {
  create,
  update,
  remove,
  getAll,
  getById,
  getByBranch,
};
