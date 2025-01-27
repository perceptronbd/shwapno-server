import { HTTP_STATUS_CODES } from "@/utils/http-status-codes";
import { TPermissions, TUser } from "../types";
import { AppError } from "@/types/error.type";
import prisma from "@/config/db.config";

const getUserByEmail = async (email: string): Promise<TUser | undefined> => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
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

    const permissions =
      user?.userRoles
        .map((role) =>
          role.role.permissions.map(
            (p) => `${p.permission.action}:${p.permission.resource}`,
          ),
        )
        .flat() ?? [];

    const role = user?.userRoles.map((role) => role.role.name) ?? [];

    const userResponse = {
      id: user!.id,
      phone: user!.phone,
      email: user!.email,
      password: user!.password,
      policy: {
        roles: role,
        permissions: permissions as TPermissions,
      },
    };

    return userResponse;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new AppError(HTTP_STATUS_CODES.NOT_FOUND, "something went wrong");
    }
  }
};
const updatePassword = () => {
  
};

export const authModels = {
  getUserByEmail,
  updatePassword,
};
