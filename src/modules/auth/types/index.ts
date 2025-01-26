import { Action, Resource, User } from "@prisma/client";
export type TPermissions = [`${Action}:${Resource}`];
export type TUser = Omit<User, "firstName" | "lastName"> & {
  policy: {
    roles: string[];
    permissions: TPermissions;
  };
};
