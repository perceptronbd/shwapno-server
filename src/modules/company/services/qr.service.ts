import QRCode, { QRCodeToDataURLOptions } from "qrcode";
import prisma from "@/config/db.config";

const generate = async ({ branchName }: { branchName: string }) => {
  console.log("generate service branchName:", branchName);
  const customerURL = process.env.CLIENT_ECOM_URL;
  const eComUrl = `${customerURL}/${branchName}=`;

  const opts: QRCodeToDataURLOptions = {
    errorCorrectionLevel: "H",
    type: "image/png" as const,
    margin: 1,
    color: {
      dark: "#000000",
      light: "#ff0000",
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
