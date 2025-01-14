import { z } from "zod";

export const ROLES = { SUPER: "super", ADMIN: "admin" } as const;

const _RolesEnum = z.nativeEnum(ROLES);

export type Role = z.infer<typeof _RolesEnum>;
