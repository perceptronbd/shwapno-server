import { JobStatus } from "../types/job.type";
import prisma from "@/config/db.config";

const create = async (): Promise<JobStatus> => {
  const job = await prisma.job.create({
    data: {
      status: "pending",
      progress: 0,
      processed: 0,
      total: 0,
      errors: [],
    },
  });

  return {
    id: job.id,
    status: job.status,
    progress: job.progress,
    processed: job.processed,
    total: job.total,
    errors: (job.errors as Array<{ row: number; message: string }>) || [],
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  };
};

const update = async (
  jobId: string,
  updates: Partial<JobStatus>,
): Promise<void> => {
  await prisma.job.update({
    where: { id: jobId },
    data: {
      ...(updates.status && { status: updates.status }),
      ...(updates.progress !== undefined && { progress: updates.progress }),
      ...(updates.processed !== undefined && {
        processed: updates.processed,
      }),
      ...(updates.total !== undefined && { total: updates.total }),
      ...(updates.errors && { errors: updates.errors }),
      ...(updates.result && { result: updates.result }),
    },
  });
};

const get = async (jobId: string): Promise<JobStatus | null> => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job) return null;

  return {
    id: job.id,
    status: job.status,
    progress: job.progress,
    processed: job.processed,
    total: job.total,
    errors: (job.errors as Array<{ row: number; message: string }>) || [],
    result: job.result as
      | { created: number; updated: number; processed: number }
      | undefined,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  };
};

const cleanup = async (): Promise<void> => {
  // Delete jobs older than 24 hours
  const expiryDate = new Date(Date.now() - 1000 * 60 * 60 * 24); // 24 hours ago

  await prisma.job.deleteMany({
    where: {
      createdAt: {
        lt: expiryDate,
      },
    },
  });
};

export const jobStatusService = {
  create,
  update,
  get,
  cleanup,
};
