import { z } from "zod";

export const IMAGE_MIME = {
  PNG: "image/png",
  JPEG: "image/jpeg",
  JPG: "image/jpg",
} as const;

export const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB

const _ImageMimeEnum = z.nativeEnum(IMAGE_MIME);

export type TImageMimeEnum = z.infer<typeof _ImageMimeEnum>;
