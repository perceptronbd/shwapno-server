import { BasicZodType } from "../validators/account.validator";
import { accountService } from "../services/account.service";
import { HTTP_STATUS_CODES } from "@utils/http-status-codes";
import { sendResponse } from "@handlers/response.handler";
import { Request, Response } from "express";

const basic = async (req: Request, res: Response) => {
  const basic: BasicZodType = req.body;

  const result = await accountService.basic(basic);

  sendResponse(
    res,
    result,
    HTTP_STATUS_CODES.CREATED,
    "Basic Information created successfully",
  );
};

const location = async (req: Request, res: Response) => {
  const { restaurantId } = req.params;
  const { location } = req.body;

  const result = await accountService.location({ restaurantId, ...location });

  sendResponse(
    res,
    result,
    HTTP_STATUS_CODES.OK,
    "Location Information created successfully",
  );
};

export const accountController = {
  basic,
  location,
};
