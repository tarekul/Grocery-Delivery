import { onValue, ref } from "firebase/database";
import { db } from "../firebase-config";

const areShoppersAvailable = async (callback) => {
  const shoppersRef = ref(db, "grocery-shopper");

  onValue(
    shoppersRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const shoppers = snapshot.val();
        const available = Object.values(shoppers).some(
          (shopper) => shopper.isAvailable === true
        );
        callback(available);
      } else {
        callback(false); // No shoppers available
      }
    },
    (error) => {
      console.error("Error fetching shopper availability:", error);
    }
  );
};

export default areShoppersAvailable;
