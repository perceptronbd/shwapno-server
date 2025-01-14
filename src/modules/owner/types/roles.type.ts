import { z } from "zod";

export const ROLES = { OWNER: "owner", ADMIN: "admin" } as const;

const _RolesEnum = z.nativeEnum(ROLES);

export type Role = z.infer<typeof _RolesEnum>;
