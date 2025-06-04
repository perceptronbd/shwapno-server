export interface ProcessExcelParams {
  branchId: string;
  fileBuffer: Buffer;
  jobId: string;
}

export interface StockProcessingResult {
  processed: number;
  created: number;
  updated: number;
  errors: Array<{ row: number; message: string }>;
}

export interface ExcelRow {
  subCategory: string;
  productCode: string;
  productName: string;
  packSize?: string;
  stock: number;
  price: number;
}
