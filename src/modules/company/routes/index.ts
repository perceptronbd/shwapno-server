import { branchRoutes } from "./branch.route";
import { Router } from "express";

const router = Router();

router.use("/branch", branchRoutes);

export const companyRoutes = router;
