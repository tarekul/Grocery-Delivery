import { v4 as uuidv4 } from "uuid";
import { useAuth } from "../contexts/authContext";

export const useCustomerId = () => {
  const { firebaseUser } = useAuth();

  // Logged-in user
  if (firebaseUser?.uid) return firebaseUser.uid;

  // Guest user
  let guestId = localStorage.getItem("guestId");
  if (!guestId) {
    guestId = uuidv4();
    localStorage.setItem("guestId", guestId);
  }
  return guestId;
};
