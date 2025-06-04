import { HTTP_STATUS_CODES } from "@/utils/http-status-codes";
import { productService } from "../services/product.service";
import { sendResponse } from "@/handlers/response.handler";
import { Request, Response } from "express";

const getByBranch = async (req: Request, res: Response) => {
  const { branchId } = req.params;
  const { limit, page } = req.query;
  const limitValue = parseInt(limit as string, 10) || 10;
  const pageValue = parseInt(page as string, 10) || 1;

  const products = await productService.getByBranch({
    branchId,
    limit: limitValue,
    page: pageValue,
  });

  sendResponse(
    res,
    products,
    HTTP_STATUS_CODES.OK,
    "Products retrieved successfully",
  );
};

export const productController = {
  getByBranch,
};
