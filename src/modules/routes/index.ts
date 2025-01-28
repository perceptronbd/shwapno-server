import { CategoryRoutes } from "../product/routes/category.route";
import { AuthRoutes } from "@modules/auth/routes/auth.route";
import { ProductRoutes } from "../product/routes";
import { UserRotes } from "../user/routes";
import { Router } from "express";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    module: AuthRoutes,
  },
  {
    path: "/users",
    module: UserRotes,
  },
  {
    path: "/products",
    module: ProductRoutes,
  },
  {
    path: "/category",
    module: CategoryRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.module);
});

export default router;
