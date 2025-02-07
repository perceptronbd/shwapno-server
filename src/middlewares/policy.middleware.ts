import { HTTP_STATUS_CODES } from "@/utils/http-status-codes";
import { sendResponse } from "@/handlers/response.handler";
import { Request, Response, NextFunction } from "express";
import { Action, Resource } from "@prisma/client";
import prisma from "@/config/db.config";
import cache from "@/helpers/cache";
import { STATUS_CODES } from "http";

interface IPolicy {
  role: string[];
  permissions: string[];
}

async function fetchRolePermissions(userId: string): Promise<IPolicy> {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    omit: { password: true },
    include: {
      userRoles: {
        include: {
          role: {
            include: {
              permissions: {
                include: {
                  permission: true,
                  role: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const permissions = user.userRoles
    .map((role) =>
      role.role.permissions.map(
        (p) => `${p.permission.action}:${p.permission.resource}`,
      ),
    )
    .flat();

  const role = user.userRoles.map((role) => role.role.name);

  return { role, permissions };
}

export function checkPolicy(role: string, action: Action, resource: Resource) {
  return async (_req: Request, res: Response, next: NextFunction) => {
    const permission = `${action}:${resource}`;

    try {
      // const userId = req.cookies.userId;
      const userId = "920e12d7-9e6d-48de-bc1f-c7ae6910f4bf";

      if (!userId) {
        sendResponse(
          res,
          STATUS_CODES.UNAUTHORIZED,
          HTTP_STATUS_CODES.UNAUTHORIZED,
          "You must be logged in to perform this action",
        );
      }

      // Check cache
      const key = `policy:${userId}`;
      let policy = cache.get(key) as IPolicy;

      if (!policy) {
        // Fetch permissions from the database
        policy = await fetchRolePermissions(userId);
        cache.set(key, policy);
      }

      if (
        !policy.role.includes(role) ||
        !policy.permissions.includes(permission)
      ) {
        sendResponse(
          res,
          STATUS_CODES.FORBIDDEN,
          HTTP_STATUS_CODES.FORBIDDEN,
          "You do not have permission to perform this action",
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
