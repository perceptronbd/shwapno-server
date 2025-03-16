import { HTTP_STATUS_CODES } from "@/utils/http-status-codes";
import { sendResponse } from "@/handlers/response.handler";
import { QRService } from "../services/qr.service";
import { Request, Response } from "express";

const get = async (req: Request, res: Response) => {
  const { branchId } = req.params;
  const qrURL = await QRService.get(branchId);
  sendResponse(
    res,
    qrURL,
    HTTP_STATUS_CODES.OK,
    "QR code fetched successfully",
  );
};

const create = async (req: Request, res: Response) => {
  const { branchId } = req.params;
  const qrURL = await QRService.generate({ branchId });
  sendResponse(
    res,
    qrURL,
    HTTP_STATUS_CODES.CREATED,
    "QR code created successfully",
  );
};

export const QRcontroller = {
  get,
  create,
};
