import crypto from "crypto";

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
}

const jobStore = new Map<string, JobStatus>();

export const jobStatusService = {
  createJob: (): JobStatus => {
    const jobId = crypto.randomUUID();
    const job: JobStatus = {
      id: jobId,
      status: "pending",
      progress: 0,
      processed: 0,
      total: 0,
      errors: [],
    };
    jobStore.set(jobId, job);
    return job;
  },

  updateJob: (jobId: string, updates: Partial<JobStatus>) => {
    const job = jobStore.get(jobId);
    if (job) {
      jobStore.set(jobId, { ...job, ...updates });
    }
  },

  getJob: (jobId: string): JobStatus | undefined => {
    return jobStore.get(jobId);
  },
};
