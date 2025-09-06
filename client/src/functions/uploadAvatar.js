import axios from "axios";
import apiUrl from "../apiUrl";

/**
 * Upload a new avatar for the given Firebase uid.
 * Returns the UPDATED user object from the server (with photoURL).
 */
export const uploadAvatar = async (uid, file) => {
  const fd = new FormData();
  fd.append("avatar", file);

  const { data } = await axios.put(
    `${apiUrl}/profile/${uid}/avatar`,
    fd,
    {
      withCredentials: true, // keep if you use cookie/session auth
      // do NOT set Content-Type; the browser adds the multipart boundary
    }
  );
  return data;
};