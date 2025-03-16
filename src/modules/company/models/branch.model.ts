import prisma from "@/config/db.config";

const getByName = async (name: string) => {
  const result = await prisma.branch.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
  });

  if (!result) {
    throw new Error("Branch not found");
  }

  return result;
};

export const branchModel = {
  getByName,
};
