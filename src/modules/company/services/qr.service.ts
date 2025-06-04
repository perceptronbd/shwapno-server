import QRCode, { QRCodeToDataURLOptions } from "qrcode";
import prisma from "@/config/db.config";

const generate = async ({ branchId }: { branchId: string }) => {
  const customerURL = process.env.CLIENT_ECOM_URL;

  const branchData = await prisma.branch.findUnique({
    where: { id: branchId },
    select: { name: true },
  });

  if (!branchData) {
    throw new Error("Branch not found");
  }

  const branchName = branchData.name;

  const eComUrl = `${customerURL}/${branchName}=`;

  const opts: QRCodeToDataURLOptions = {
    errorCorrectionLevel: "H",
    type: "image/png" as const,
    margin: 1,
    color: {
      dark: "#df0000",
      light: "#ffffff",
    },
  };

  const qrDataUrl = await QRCode.toDataURL(eComUrl, opts);

  return await prisma.branch.update({
    where: { name: branchName },
    data: { qrURL: qrDataUrl },
  });
};

const get = async (branchId: string) => {
  return await prisma.branch.findUnique({
    where: { id: branchId },
    select: { qrURL: true },
  });
};

export const QRService = {
  generate,
  get,
};
