import { QRService } from "./qr.service";
import prisma from "@/config/db.config";
import QRCode from "qrcode";

jest.mock("qrcode");
jest.mock("@/config/db.config", () => ({
  branch: {
    update: jest.fn(),
    findUnique: jest.fn(),
  },
}));

describe("QR Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.CLIENT_ECOM_URL = "https://example.com";
  });

  describe("generate", () => {
    it("should generate a QR code and update branch", async () => {
      const branchId = "branch-123";
      const branchName = "Main Branch";
      const qrDataUrl = "data:image/png;base64,abc123";
      const mockBranch = {
        id: branchId,
        name: branchName,
        qrURL: qrDataUrl,
      };

      // Mock the branch lookup
      (prisma.branch.findUnique as jest.Mock).mockResolvedValueOnce({
        name: branchName,
      });

      (QRCode.toDataURL as jest.Mock).mockResolvedValue(qrDataUrl);
      (prisma.branch.update as jest.Mock).mockResolvedValue(mockBranch);

      const result = await QRService.generate({ branchId });

      // Verify branch lookup was called
      expect(prisma.branch.findUnique).toHaveBeenCalledWith({
        where: { id: branchId },
        select: { name: true },
      });

      expect(QRCode.toDataURL).toHaveBeenCalledWith(
        `https://example.com/${branchName}=`,
        expect.objectContaining({
          errorCorrectionLevel: "H",
          type: "image/png",
          margin: 1,
          color: {
            dark: "#df0000",
            light: "#ffffff",
          },
        }),
      );

      expect(prisma.branch.update).toHaveBeenCalledWith({
        where: { name: branchName },
        data: { qrURL: qrDataUrl },
      });

      expect(result).toEqual(mockBranch);
    });

    it("should throw an error if branch is not found", async () => {
      const branchId = "branch-123";

      // Mock branch not found
      (prisma.branch.findUnique as jest.Mock).mockResolvedValueOnce(null);

      await expect(QRService.generate({ branchId })).rejects.toThrow(
        "Branch not found",
      );

      expect(QRCode.toDataURL).not.toHaveBeenCalled();
      expect(prisma.branch.update).not.toHaveBeenCalled();
    });

    it("should handle errors when generating QR code", async () => {
      const branchId = "branch-123";
      const error = new Error("Failed to generate QR code");

      // Mock the branch lookup
      (prisma.branch.findUnique as jest.Mock).mockResolvedValueOnce({
        name: "Main Branch",
      });

      (QRCode.toDataURL as jest.Mock).mockRejectedValue(error);

      await expect(QRService.generate({ branchId })).rejects.toThrow(
        "Failed to generate QR code",
      );

      expect(prisma.branch.update).not.toHaveBeenCalled();
    });
  });

  describe("get", () => {
    it("should fetch QR code by branch ID", async () => {
      const branchId = "branch-123";
      const mockQRURL = { qrURL: "data:image/png;base64,abc123" };

      (prisma.branch.findUnique as jest.Mock).mockResolvedValue(mockQRURL);

      const result = await QRService.get(branchId);

      expect(prisma.branch.findUnique).toHaveBeenCalledWith({
        where: { id: branchId },
        select: { qrURL: true },
      });

      expect(result).toEqual(mockQRURL);
    });

    it("should handle errors when fetching QR code", async () => {
      const branchId = "branch-123";
      const error = new Error("Failed to fetch QR code");

      (prisma.branch.findUnique as jest.Mock).mockRejectedValue(error);

      await expect(QRService.get(branchId)).rejects.toThrow(
        "Failed to fetch QR code",
      );
    });
  });
});
