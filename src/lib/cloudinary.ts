// src/lib/cloudinary.ts
// Utility for uploading images from the browser directly to Cloudinary (unsigned)

export const uploadToCloudinary = async (file: File): Promise<string> => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Kredensial Cloudinary belum diatur di .env.local");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Gagal mengunggah gambar ke Cloudinary");
  }

  const data = await response.json();
  // We return the secure URL to be saved in Firestore or Tiptap HTML content
  return data.secure_url;
};
