import axios from "axios";
import apiUrl from "../apiUrl";

export const cancelOrder = (orderId) => {
  return axios
    .delete(`${apiUrl}/order/${orderId}`)
    .then((res) => {
      console.log("Cancellation Response:", res.data);
      return res.data;
    })
    .catch((err) => {
      console.error("Error cancelling order:", err);
      throw err;
    });
};
