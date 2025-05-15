import { authenticateJWT } from "@/middlewares/auth.middleware";
import { authRoutes } from "@modules/auth/routes/auth.route";
import { customerRoutes } from "./modules/customer/routes";
import { productRoutes } from "./modules/product/routes";
import { companyRoutes } from "./modules/company/routes";
import { ordersRoutes } from "./modules/order/routes";
import { userRotes } from "./modules/user/routes";
import { Router } from "express";

const router = Router();

const moduleRoutes = [
  {
    protected: false,
    path: "/auth",
    module: authRoutes,
  },
  {
    protected: true,
    path: "/companies",
    module: companyRoutes,
  },
  {
    protected: true,
    path: "/users",
    module: userRotes,
  },
  {
    protected: true, //changed for testing
    path: "/products",
    module: productRoutes,
  },
  {
    protected: true,
    path: "/orders",
    module: ordersRoutes,
  },
  {
    protected: false,
    path: "/customers",
    module: customerRoutes,
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
