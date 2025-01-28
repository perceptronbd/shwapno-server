import { categoryService } from "../services/category.service";
import { HTTP_STATUS_CODES } from "@utils/http-status-codes";
import { sendResponse } from "@handlers/response.handler";
import { Request, Response } from "express";

const create = async (req: Request, res: Response) => {
  const result = await categoryService.create(req.body);
  sendResponse(
    res,
    result,
    HTTP_STATUS_CODES.CREATED,
    "Category created successfully",
  );
};

const update = async (req: Request, res: Response) => {
  const id = req.params.id;
  const category = req.body;
  const result = await categoryService.update({ id, category });
  sendResponse(
    res,
    result,
    HTTP_STATUS_CODES.OK,
    "Category updated successfully",
  );
};

const remove = async (req: Request, res: Response) => {
  await categoryService.remove({ id: req.params.id });
  sendResponse(
    res,
    null,
    HTTP_STATUS_CODES.OK,
    "Category deleted successfully",
  );
};

const getAll = async (_: Request, res: Response) => {
  const categories = await categoryService.getAll();
  sendResponse(
    res,
    categories,
    HTTP_STATUS_CODES.OK,
    "Categories retrieved successfully",
  );
};

const getById = async (req: Request, res: Response) => {
  const category = await categoryService.getById(req.params.id);
  sendResponse(
    res,
    category,
    HTTP_STATUS_CODES.OK,
    "Category retrieved successfully",
  );
};

const getByBranch = async (req: Request, res: Response) => {
  const categories = await categoryService.getByBranch({
    branchId: req.params.id,
  });
  sendResponse(
    res,
    categories,
    HTTP_STATUS_CODES.OK,
    "Categories retrieved successfully",
  );
};

export const categoryController = {
  create,
  update,
  remove,
  getAll,
  getById,
  getByBranch,
};
