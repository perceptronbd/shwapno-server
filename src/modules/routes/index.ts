import { AuthRoutes } from "@modules/auth/routes/auth.route";
import { UserRotes } from "../user/routes";
import { Router } from "express";

const router = Router();

const moduleRoutes = [
  {
    path: "/",
    module: AuthRoutes,
  },
  {
    path: "/users",
    module: UserRotes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.module);
});

export default router;
