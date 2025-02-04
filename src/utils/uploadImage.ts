import cloudinary from "@/config/cloudinary.config";

export const uploadImage = (
  imageBuffer: Buffer,
  mimetype: string,
): Promise<string> => {
  const format = mimetype.split("/")[1] || "png";

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "product_images",
        resource_type: "image",
        type: "auto",
        format,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result!.secure_url);
        }
      },
    );
    uploadStream.end(imageBuffer);
  });
};
