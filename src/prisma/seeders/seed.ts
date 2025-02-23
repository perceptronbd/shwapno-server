import { QRService } from "@/modules/company/services/qr.service";
import { PrismaClient, Action, Resource } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function clearDatabse() {
  // Delete all data from all tables
  await prisma.$executeRaw`TRUNCATE "role_permissions", "permissions", "user_roles", "roles", "users", "stocks", "products", "invoices", "sales", "orders", "customers", "branches", "companies" CASCADE;`;
}

async function main() {
  await clearDatabse();

  // Create company and branch
  const company = await prisma.company.create({
    data: { name: "Shwapno" },
  });

  const branch = await prisma.branch.create({
    data: {
      name: "Nurer Chala",
      location: "456 Main Street",
      companyId: company.id,
    },
  });

  QRService.generate({ company: company.id, branchId: branch.id });

  // Create roles
  const adminRole = await prisma.role.create({
    data: {
      name: "admin",
      companyId: company.id,
    },
  });

  const managerRole = await prisma.role.create({
    data: {
      name: "manager",
      companyId: company.id,
    },
  });

  const salesRole = await prisma.role.create({
    data: {
      name: "salesperson",
      companyId: company.id,
    },
  });

  // Create permissions
  const permissions = await prisma.$transaction(async (tx) => {
    // Create all possible permission combinations
    const resources = [
      Resource.ALL,
      Resource.USER,
      Resource.COMPANY,
      Resource.BRANCH,
      Resource.PRODUCT,
      Resource.ORDER,
      Resource.STOCK,
      Resource.INVOICE,
      Resource.SALES,
      Resource.CUSTOMER,
    ];
    const actions = [Action.READ, Action.WRITE];

    const permissionPromises = [];
    for (const resource of resources) {
      for (const action of actions) {
        permissionPromises.push(
          tx.permission.create({
            data: { action, resource },
          }),
        );
      }
    }

    return await Promise.all(permissionPromises);
  });

  // Assign permissions to roles
  await prisma.$transaction(async (tx) => {
    // Admin gets all permissions
    const adminPermissions = permissions.map((perm) => ({
      roleId: adminRole.id,
      permissionId: perm.id,
    }));
    await tx.rolePermission.createMany({ data: adminPermissions });

    // Manager gets everything except company-level permissions
    const managerPermissions = permissions
      .filter(
        (p) => p.resource !== Resource.COMPANY && p.resource !== Resource.ALL,
      )
      .map((perm) => ({
        roleId: managerRole.id,
        permissionId: perm.id,
      }));
    await tx.rolePermission.createMany({ data: managerPermissions });

    // Sales person gets read-all and only write for sales/orders
    const salesPermissions = permissions
      .filter(
        (p) =>
          p.action === Action.READ ||
          (p.action === Action.WRITE &&
            (p.resource === Resource.SALES || p.resource === Resource.ORDER)),
      )
      .map((perm) => ({
        roleId: salesRole.id,
        permissionId: perm.id,
      }));
    await tx.rolePermission.createMany({ data: salesPermissions });
  });

  // Create admin user
  const hashedPassword = await bcrypt.hash("password1234", 10);
  const adminUser = await prisma.user.create({
    data: {
      firstName: "MD Shohag",
      lastName: "Miya",
      email: "shohag@shwapno.com",
      phone: "01712345678",
      password: hashedPassword,
    },
  });

  // Assign admin role to user
  await prisma.userRole.create({
    data: {
      userId: adminUser.id,
      roleId: adminRole.id,
      branchId: branch.id,
    },
  });

  // Create test product and stock
  const product = await prisma.product.create({
    data: {
      name: "Product 1",
      price: 10,
      description: "Product 1 description",
    },
  });

  await prisma.stock.create({
    data: {
      quantity: 10,
      productId: product.id,
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
