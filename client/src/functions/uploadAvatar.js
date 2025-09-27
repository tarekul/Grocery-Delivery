import axios from "axios";

const CLOUD_NAME    = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

export const uploadAvatar = async (file, { onProgress } = {}) => {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Cloudinary env vars missing");
  }

  // unsigned endpoint
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET);
  // DO NOT append public_id / overwrite / transformation here.
  // If you want a fixed folder, set it in the preset settings.

  try {
    const { data } = await axios.post(url, fd, {
      onUploadProgress: (evt) => {
        if (onProgress && evt.total) {
          onProgress(Math.round((evt.loaded * 100) / evt.total));
        }
      },
    });
console.log("Cloudinary upload response:", data.secure_url);
return data.secure_url;
  } catch (err) {
    const msg = err?.response?.data?.error?.message || err.message;
    throw new Error(`Cloudinary upload failed: ${msg}`);
  }
};
