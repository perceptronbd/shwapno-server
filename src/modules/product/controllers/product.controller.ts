import { HTTP_STATUS_CODES } from "@/utils/http-status-codes";
import { productService } from "../services/product.service";
import { sendResponse } from "@/handlers/response.handler";
import { Request, Response } from "express";

const create = async (req: Request, res: Response) => {
  const { branchId } = req.params;
  const productData = req.body;

  const filePath = req.file?.path;
  const mimetype = req.file?.mimetype;

  const result = await productService.create({
    branchId,
    productData,
    filePath,
    mimetype,
  });

  sendResponse(
    res,
    result,
    HTTP_STATUS_CODES.CREATED,
    "Product created successfully",
  );
};

const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const productData = req.body;

  const filePath = req.file?.path;
  const mimetype = req.file?.mimetype;

  const result = await productService.update({
    id,
    productData,
    filePath,
    mimetype,
  });

  sendResponse(
    res,
    result,
    HTTP_STATUS_CODES.OK,
    "Product updated successfully",
  );
};

const remove = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await productService.remove({ id });

  sendResponse(
    res,
    result,
    HTTP_STATUS_CODES.OK,
    "Product deleted successfully",
  );
};

const getAll = async (_: Request, res: Response) => {
  const { data, meta } = await productService.getAll(_?.query);

  sendResponse(
    res,
    data,
    HTTP_STATUS_CODES.OK,
    "Products retrieved successfully",
    meta,
  );
};

const getById = async (req: Request, res: Response) => {
  const { id } = req.params;

  const result = await productService.getById(id);

  sendResponse(
    res,
    result,
    HTTP_STATUS_CODES.OK,
    "Product retrieved successfully",
  );
};

const getByCategory = async (req: Request, res: Response) => {
  const { branchId } = req.params;

  const category = req.query.category as string;

  const result = await productService.getByCategory({ branchId, category });

  sendResponse(
    res,
    result,
    HTTP_STATUS_CODES.OK,
    "Products fetched successfully",
  );
};

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
  create,
  update,
  remove,
  getAll,
  getById,
  getByCategory,
  getByBranch,
};
