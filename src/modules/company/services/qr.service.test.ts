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
      const branchName = "Main Branch";
      const qrDataUrl = "data:image/png;base64,abc123";
      const mockBranch = {
        id: "branch-123",
        name: branchName,
        qrURL: qrDataUrl,
      };

      (QRCode.toDataURL as jest.Mock).mockResolvedValue(qrDataUrl);
      (prisma.branch.update as jest.Mock).mockResolvedValue(mockBranch);

      const result = await QRService.generate({ branchName });

      expect(QRCode.toDataURL).toHaveBeenCalledWith(
        `https://example.com/${branchName}=`,
        expect.objectContaining({
          errorCorrectionLevel: "H",
          type: "image/png",
          margin: 1,
          color: {
            dark: "#000000",
            light: "#ff0000",
          },
        }),
      );

      expect(prisma.branch.update).toHaveBeenCalledWith({
        where: { name: branchName },
        data: { qrURL: qrDataUrl },
      });

      expect(result).toEqual(mockBranch);
    });

    it("should handle errors when generating QR code", async () => {
      const branchName = "Main Branch";
      const error = new Error("Failed to generate QR code");

      (QRCode.toDataURL as jest.Mock).mockRejectedValue(error);

      await expect(QRService.generate({ branchName })).rejects.toThrow(
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
