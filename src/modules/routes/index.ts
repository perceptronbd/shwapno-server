import { RestaurantRoutes } from "@modules/restaurant/routes/index";
import { AuthRoutes } from "@modules/auth/routes/auth.route";
import { AdminRoutes } from "@modules/admin/routes/index";
import { Router } from "express";

const router = Router();

const moduleRoutes = [
  {
    path: "/",
    module: AuthRoutes,
  },
  {
    path: "/super-admin",
    module: AdminRoutes,
  },
  {
    path: "/restaurant",
    module: RestaurantRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.module);
});

export default router;
