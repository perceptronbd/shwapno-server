import { authenticateJWT } from "../../../middlewares/auth.middleware";
import { accountController } from "../controllers/account.controller";
import { validate } from "../../../middlewares/validate.middleware";
import { AccountValidate } from "../validators/account.validator";
import { authController } from "../controllers/auth.controller";
import { asyncHandler } from "../../../handlers/async.handler";
import { AuthValidate } from "../validators/auth.validator";
import { Router } from "express";

const router = Router();

router.put(
  "/basic",
  validate(AccountValidate.basic),
  asyncHandler(accountController.basic),
);

router.put(
  "/location/:restaurantId",
  validate(AccountValidate.location),
  asyncHandler(accountController.location),
);

router.put(
  "/password/:ownerId",
  validate(AuthValidate.createPassword),
  asyncHandler(authController.createPassword),
);

router.post(
  "/login",
  validate(AuthValidate.login),
  asyncHandler(authController.login),
);

router.post(
  "/logout",
  validate(AuthValidate.login),
  authenticateJWT,
  asyncHandler(authController.logout),
);

export const RestaurantRoutes = router;
