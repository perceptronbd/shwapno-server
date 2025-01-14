import { z } from "zod";

const createPassword = z.object({
  body: z.object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters long" })
      .nonempty({ message: "Password is required" }),
  }),
  params: z.object({
    ownerId: z.string().nonempty({ message: "Owner ID is required" }),
  }),
});

const login = z.object({
  body: z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string(),
    rememberMe: z.boolean().default(false),
  }),
});

export const AuthValidate = {
  createPassword,
  login,
};

export type CreatePasswordZodType = z.infer<
  typeof AuthValidate.createPassword
>["body"] &
  z.infer<typeof AuthValidate.createPassword>["params"];
export type LoginZodType = z.infer<typeof AuthValidate.login>["body"];
