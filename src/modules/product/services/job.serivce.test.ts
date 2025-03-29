import { jobStatusService } from "./job.service";
import prisma from "@/config/db.config";

// Mock Prisma
jest.mock("@/config/db.config", () => ({
  job: {
    create: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn(),
    deleteMany: jest.fn(),
  },
}));

describe("Job Status Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createJob", () => {
    it("should create a new job with default values", async () => {
      const mockJob = {
        id: "test-uuid",
        status: "pending",
        progress: 0,
        processed: 0,
        total: 0,
        errors: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.job.create as jest.Mock).mockResolvedValue(mockJob);

      const result = await jobStatusService.create();

      expect(prisma.job.create).toHaveBeenCalledWith({
        data: {
          status: "pending",
          progress: 0,
          processed: 0,
          total: 0,
          errors: [],
        },
      });

      expect(result).toEqual({
        id: "test-uuid",
        status: "pending",
        progress: 0,
        processed: 0,
        total: 0,
        errors: [],
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });

  describe("updateJob", () => {
    it("should update an existing job with provided values", async () => {
      const jobId = "test-uuid";
      const updates = {
        status: "processing" as const,
        progress: 50,
        processed: 10,
        total: 20,
      };

      await jobStatusService.update(jobId, updates);

      expect(prisma.job.update).toHaveBeenCalledWith({
        where: { id: jobId },
        data: {
          status: "processing",
          progress: 50,
          processed: 10,
          total: 20,
        },
      });
    });

    it("should only update specified fields", async () => {
      const jobId = "test-uuid";
      const updates = {
        progress: 75,
      };

      await jobStatusService.update(jobId, updates);

      expect(prisma.job.update).toHaveBeenCalledWith({
        where: { id: jobId },
        data: {
          progress: 75,
        },
      });
    });
  });

  describe("getJob", () => {
    it("should return job data when job exists", async () => {
      const jobId = "test-uuid";
      const mockJob = {
        id: jobId,
        status: "completed",
        progress: 100,
        processed: 20,
        total: 20,
        errors: [],
        result: { created: 5, updated: 15, processed: 20 },
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.job.findUnique as jest.Mock).mockResolvedValue(mockJob);

      const result = await jobStatusService.get(jobId);

      expect(prisma.job.findUnique).toHaveBeenCalledWith({
        where: { id: jobId },
      });

      expect(result).toEqual({
        id: jobId,
        status: "completed",
        progress: 100,
        processed: 20,
        total: 20,
        errors: [],
        result: { created: 5, updated: 15, processed: 20 },
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it("should return null when job does not exist", async () => {
      const jobId = "non-existent-id";

      (prisma.job.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await jobStatusService.get(jobId);

      expect(prisma.job.findUnique).toHaveBeenCalledWith({
        where: { id: jobId },
      });

      expect(result).toBeNull();
    });
  });

  describe("cleanupExpiredJobs", () => {
    it("should delete jobs older than 24 hours", async () => {
      // Mock Date.now to return a fixed timestamp
      const now = new Date("2023-01-01T12:00:00Z").getTime();
      jest.spyOn(Date, "now").mockReturnValue(now);

      await jobStatusService.cleanup();

      // Calculate expected expiry date (24 hours ago)
      const expiryDate = new Date(now - 1000 * 60 * 60 * 24);

      expect(prisma.job.deleteMany).toHaveBeenCalledWith({
        where: {
          createdAt: {
            lt: expiryDate,
          },
        },
      });

      // Restore Date.now
      (Date.now as jest.Mock).mockRestore();
    });
  });
});
