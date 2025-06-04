import prisma from "@/config/db.config";

const getById = async (id: string) => {
  const result = await prisma.branch.findFirst({
    where: {
      id,
    },
  });

  if (!result) {
    throw new Error("Branch not found");
  }

  return result;
};

export const branchModel = {
  getById,
};
