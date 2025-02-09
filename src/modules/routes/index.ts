import { authenticateJWT } from "@/middlewares/auth.middleware";
import { AuthRoutes } from "@modules/auth/routes/auth.route";
import { CustomerRoutes } from "../customer/routes";
import { Product } from "../product/routes";
import { UserRotes } from "../user/routes";
import { Router } from "express";

const router = Router();

const moduleRoutes = [
  {
    protected: false,
    path: "/auth",
    module: AuthRoutes,
  },
  {
    protected: true,
    path: "/users",
    module: UserRotes,
  },
  {
    protected: true,
    path: "/products",
    module: Product,
  },
  {
    path: "/customers",
    module: CustomerRoutes,
  },
];

moduleRoutes.forEach((route) => {
  if (route.protected) {
    router.use(route.path, authenticateJWT, route.module);
  } else {
    router.use(route.path, route.module);
  }
});

export default router;
