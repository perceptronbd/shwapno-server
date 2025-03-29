export interface JobStatus {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  progress: number;
  processed: number;
  total: number;
  errors: Array<{ row: number; message: string }>;
  result?: {
    created: number;
    updated: number;
    processed: number;
  };
  createdAt: Date;
  updatedAt: Date;
}
