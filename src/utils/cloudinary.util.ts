import cloudinary from "@/config/cloudinary.config";

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
}

export const uploadImage = (
  filePath: string,
  mimetype: string,
  folder: string,
): Promise<CloudinaryUploadResult> => {
  const format = mimetype.split("/")[1] || "png";

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      filePath,
      {
        folder,
        resource_type: "image",
        format,
      },
      (error, result) => {
        if (error) {
          console.error(error);
          reject(new Error("Image upload failed!"));
        } else if (result) {
          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
          });
        } else {
          reject(new Error("Unknown error during image upload"));
        }
      },
    );
  });
};

export const deleteImage = (publicId: string): Promise<unknown> => {
  console.log("executing deleteImage...");
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(
      publicId,
      { resource_type: "image" },
      (error, result) => {
        if (error) {
          console.error(error);
          reject(new Error("Image deletion failed!"));
        } else {
          resolve(result);
        }
      },
    );
  });
};
