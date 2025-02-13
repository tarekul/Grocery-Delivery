import axios from "axios";
import apiUrl from "../apiUrl";

export const cancelOrder = (orderId, email) => {
  return axios
    .post(`${apiUrl}/order/cancel/${orderId}`, { email })
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
