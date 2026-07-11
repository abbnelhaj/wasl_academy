"use server";

import { writeClient } from "@/sanity/lib/client";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
]);

export async function uploadImage(formData: FormData) {
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return { error: "No image file was provided" };
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return { error: "Only JPEG, PNG, GIF, and WebP images are supported" };
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return { error: "Image must be smaller than 10MB" };
  }

  if (!process.env.SANITY_API_WRITE_TOKEN) {
    return { error: "Missing SANITY_API_WRITE_TOKEN" };
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const asset = await writeClient.assets.upload("image", buffer, {
      filename: file.name,
      contentType: file.type,
    });

    return { assetId: asset._id };
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "Failed to upload image asset",
    };
  }
}
