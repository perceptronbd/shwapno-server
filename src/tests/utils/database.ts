import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const cleanupDatabase = async () => {
  await prisma.userRole.deleteMany({});
  await prisma.rolePermission.deleteMany({});
  await prisma.permission.deleteMany({});
  await prisma.role.deleteMany({});
  await prisma.branch.deleteMany({});
  await prisma.company.deleteMany({});
  await prisma.user.deleteMany({});
};

export default prisma;
