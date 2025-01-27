import { hashPassword, validatePassword } from "@/helpers/auth.helper";
import { TResetPasswordRequest } from "../validators/auth.validate";
import { HTTP_STATUS_CODES } from "@/utils/http-status-codes";
import { TPermissions, TUser } from "../types";
import { AppError } from "@/types/error.type";
import prisma from "@/config/db.config";

const getUserByEmail = async (email: string): Promise<TUser | undefined> => {
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

  if (!user) throw new AppError(HTTP_STATUS_CODES.NOT_FOUND, "User not found");

  const permissions = user.userRoles
    .map((role) =>
      role.role.permissions.map(
        (p) => `${p.permission.action}:${p.permission.resource}`,
      ),
    )
    .flat();

  const role = user.userRoles.map((role) => role.role.name);

  const userResponse = {
    id: user.id,
    phone: user.phone,
    email: user.email,
    password: user.password,
    policy: {
      roles: role,
      permissions: permissions as TPermissions,
    },
  };

  return userResponse;
};

const updatePassword = async ({ email, password }: TResetPasswordRequest) => {
  const user = await getUserByEmail(email);
  const isPasswordValid = await validatePassword(password, user!.password);

  if (!isPasswordValid) {
    throw new AppError(HTTP_STATUS_CODES.UNAUTHORIZED, "Invalid password");
  }

  const hashedPassword = await hashPassword(user!.password);
  const updatedUser = await prisma.user.update({
    where: {
      email: email,
    },
    data: {
      password: hashedPassword,
    },
  });

  return updatedUser;
};

export const authModels = {
  getUserByEmail,
  updatePassword,
};
