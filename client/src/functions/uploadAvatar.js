import axios from "axios";

const CLOUD_NAME    = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

const publicIdFor = (uid) => `avatars/${uid}`;

export const uploadAvatar = async (uid, file, { onProgress } = {}) => {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Cloudinary env vars missing");
  }

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", UPLOAD_PRESET);
  fd.append("folder", "grocerygo/avatars");     // allowed for unsigned
  fd.append("public_id", publicIdFor(uid));     // allowed for unsigned
  // DO NOT send overwrite for unsigned
  // DO NOT send 'transformation' here for unsigned; set it in the preset if needed

  try {
    const { data } = await axios.post(url, fd, {
      onUploadProgress: (evt) => {
        if (onProgress && evt.total) {
          onProgress(Math.round((evt.loaded * 100) / evt.total));
        }
      },
    });
    return data.secure_url; // contains versioned URL (v###)
  } catch (err) {
    // bubble the Cloudinary message so you can show a friendly toast
    const msg = err?.response?.data?.error?.message || err.message;
    throw new Error(`Cloudinary upload failed: ${msg}`);
  }
};

