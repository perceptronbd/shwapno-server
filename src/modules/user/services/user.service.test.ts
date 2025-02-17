import { userProfile } from "@/tests/utils/test-data";
import { userService } from "./user.service";
import prisma from "@/config/db.config";

jest.mock("@/config/db.config", () => ({
  user: {
    findUnique: jest.fn(),
  },
}));

describe("User Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Get Profile", () => {
    it("should get user profile", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(userProfile);

      const result = await userService.getProfile(userProfile.id);

      expect(result).toEqual(userProfile);
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: userProfile.id },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          userRoles: {
            select: {
              role: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
    });

    it("should return null when user is not found", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const result = await userService.getProfile("non-existent-id");

      expect(result).toBeNull();
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "non-existent-id" },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          userRoles: {
            select: {
              role: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
    });

    it("should throw error when database query fails", async () => {
      const error = new Error("Database error");
      (prisma.user.findUnique as jest.Mock).mockRejectedValue(error);

      await expect(userService.getProfile("some-id")).rejects.toThrow(error);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "some-id" },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          userRoles: {
            select: {
              role: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
    });
  });
});
