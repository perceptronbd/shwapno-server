import { PrismaClient, Action, Resource } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function clearDatabse() {
  await prisma.userRole.deleteMany({});
  await prisma.rolePermission.deleteMany({});
  await prisma.permission.deleteMany({});
  await prisma.role.deleteMany({});
  await prisma.branch.deleteMany({});
  await prisma.company.deleteMany({});
  await prisma.user.deleteMany({});
}

async function main() {
  // Clear the database
  await clearDatabse();
  // Create a company
  const company = await prisma.company.create({
    data: {
      name: "Shwapno",
    },
  });

  // Create a branch
  const branch = await prisma.branch.create({
    data: {
      name: "Nurer Chala",
      location: "456 Main Street",
      companyId: company.id,
    },
  });

  // Create a role
  const role = await prisma.role.create({
    data: {
      name: "admin",
      companyId: company.id,
    },
  });

  // Create a permission for all the resources and actions combination
  await prisma.permission.createMany({
    data: [
      {
        action: Action.WRITE,
        resource: Resource.ALL,
      },
      {
        action: Action.READ,
        resource: Resource.ALL,
      },
      {
        action: Action.READ,
        resource: Resource.BRANCH,
      },
      {
        action: Action.READ,
        resource: Resource.COMPANY,
      },
      {
        action: Action.READ,
        resource: Resource.USER,
      },
      {
        action: Action.READ,
        resource: Resource.CUSTOMER,
      },
      {
        action: Action.READ,
        resource: Resource.PRODUCT,
      },
      {
        action: Action.READ,
        resource: Resource.STOCK,
      },
      {
        action: Action.READ,
        resource: Resource.ORDER,
      },
      {
        action: Action.READ,
        resource: Resource.INVOICE,
      },
      {
        action: Action.READ,
        resource: Resource.SALES,
      },
      {
        action: Action.WRITE,
        resource: Resource.BRANCH,
      },
      {
        action: Action.WRITE,
        resource: Resource.COMPANY,
      },
      {
        action: Action.WRITE,
        resource: Resource.USER,
      },
      {
        action: Action.WRITE,
        resource: Resource.CUSTOMER,
      },
      {
        action: Action.WRITE,
        resource: Resource.PRODUCT,
      },
      {
        action: Action.WRITE,
        resource: Resource.STOCK,
      },
      {
        action: Action.WRITE,
        resource: Resource.ORDER,
      },
      {
        action: Action.WRITE,
        resource: Resource.INVOICE,
      },
      {
        action: Action.WRITE,
        resource: Resource.SALES,
      },
    ],
  });

  // Assign permission of action all and resource all to role
  await prisma.$transaction(async (prisma) => {
    const permissionWrite = await prisma.permission.findFirst({
      where: {
        action: Action.WRITE,
        resource: Resource.ALL,
      },
    });
    const permissionRead = await prisma.permission.findFirst({
      where: {
        action: Action.READ,
        resource: Resource.ALL,
      },
    });

    if (permissionRead && permissionWrite) {
      await prisma.rolePermission.createMany({
        data: [
          {
            roleId: role.id,
            permissionId: permissionRead?.id,
          },
          { roleId: role.id, permissionId: permissionWrite?.id },
        ],
      });
    }
  });

  // Create a user
  const hashedPassword = await bcrypt.hash("password1234", 10);
  const user = await prisma.user.create({
    data: {
      firstName: "MD Shohag",
      lastName: "Miya",
      email: "shohag@shwapno.com",
      phone: "01712345678",
      password: hashedPassword,
    },
  });

  // Assign role to user in the branch
  await prisma.userRole.create({
    data: {
      userId: user.id,
      roleId: role.id,
      branchId: branch.id,
    },
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
