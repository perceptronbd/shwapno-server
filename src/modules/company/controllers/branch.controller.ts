import { HTTP_STATUS_CODES } from "@/utils/http-status-codes";
import { sendResponse } from "@/handlers/response.handler";
import { branchService } from "../services/branch.service";
import { Request, Response } from "express";

const getByName = async (req: Request, res: Response) => {
  const branch = await branchService.getByName(req.params.name);
  sendResponse(
    res,
    branch,
    HTTP_STATUS_CODES.OK,
    "Branch retrieved successfully",
  );
};

export const branchController = {
  getByName,
};
