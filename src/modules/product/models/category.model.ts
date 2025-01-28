import prisma from "@/config/db.config";

// Get all categories
const getAllCategories = async () => {
  return await prisma.category.findMany();
};

// Get a category by ID
const findCategoryById = async (id: string) => {
  return await prisma.category.findUnique({
    where: { id },
  });
};

// Get categories by branch
const findCategoriesByBranch = async (branchId: string) => {
  return await prisma.category.findMany({
    where: {
      BranchCategory: {
        some: {
          branchId,
        },
      },
    },
    include: {
      BranchCategory: true,
    },
  });
};

export const categoryModels = {
  getAllCategories,
  findCategoryById,
  findCategoriesByBranch,
};
