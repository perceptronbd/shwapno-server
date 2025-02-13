import { HTTP_STATUS_CODES } from "@/utils/http-status-codes";
import { AppError } from "@/types/error.type";
import prisma from "@/config/db.config";

const addStock = async ({
  branchId,
  productId,
  quantity,
}: {
  branchId: string;
  productId: string;
  quantity: number;
}) => {
  const stock = await prisma.stock.findUnique({
    where: {
      branchId_productId: {
        branchId,
        productId,
      },
    },
  });

  if (!stock) {
    throw new Error("Stock not found");
  }

  const stockQuantity = stock?.quantity || 0;

  const addedStock = await prisma.stock.update({
    where: { id: stock.id },
    data: {
      quantity: stockQuantity + quantity,
    },
  });

  return addedStock;
};

const getAll = async ({
  id,
  page = 1,
  limit = 10,
}: {
  id: string;
  page: number;
  limit: number;
}) => {
  const skip = (page - 1) * limit;

  // First get the user's company through any branch role
  const userCompany = await prisma.userRole.findFirst({
    where: { userId: id },
    select: {
      branch: {
        select: {
          companyId: true,
        },
      },
    },
  });

  if (!userCompany) {
    throw new AppError(
      HTTP_STATUS_CODES.NOT_FOUND,
      "No company association found",
    );
  }

  const companyId = userCompany.branch.companyId;

  // Then get all stocks from all branches of that company
  const [stocks, total] = await prisma.$transaction([
    prisma.stock.findMany({
      where: {
        branch: {
          companyId: companyId,
        },
      },
      include: {
        product: true,
        branch: {
          select: {
            name: true,
            location: true,
          },
        },
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.stock.count({
      where: {
        branch: {
          companyId: companyId,
        },
      },
    }),
  ]);

  return {
    stocks,
    pagination: {
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
      limit,
    },
  };
};

export const stockModel = {
  addStock,
  getAll,
};
