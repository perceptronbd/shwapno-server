import { PERMISSIONS } from "@modules/admin/types/permissions.type";
import { ROLES } from "@modules/admin/types/roles.type";
import { z } from "zod";

const create = z.object({
  body: z.object({
    username: z
      .string()
      .min(2, { message: "Username must be at least 2 characters long" })
      .max(255, { message: "Username must be at most 255 characters long" })
      .nonempty({ message: "Username is required" }),
    email: z
      .string()
      .email({ message: "Invalid email address" })
      .nonempty({ message: "Email is required" }),
    phone: z
      .string()
      .min(11, { message: "Phone number must be exactly 11 characters long" })
      .max(11, { message: "Phone number must be exactly 11 characters long" })
      .nonempty({ message: "Phone is required" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(255, { message: "Password must be at most 255 characters long" })
      .nonempty({ message: "Password is required" }),
    roles: z
      .array(
        z.enum(Object.values(ROLES) as [string, ...string[]], {
          message: "Invalid role",
        }),
      )
      .nonempty({ message: "Role is required" }),
    permission: z
      .array(
        z.enum(Object.values(PERMISSIONS) as [string, ...string[]], {
          message: "Invalid permission",
        }),
      )
      .nonempty({ message: "Permission is required" }),
  }),
});

const login = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string(),
    rememberMe: z.boolean().default(false),
  }),
});

export const AdminValidate = {
  create,
  login,
};

export type CreateZodType = z.infer<typeof AdminValidate.create>["body"];
export type LoginZodType = z.infer<typeof AdminValidate.login>["body"];
