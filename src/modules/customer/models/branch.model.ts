import prisma from "@/config/db.config";

const getByName = async (name: string) => {
  return await prisma.branch.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
  });
};

export const branchModel = {
  getByName,
};
