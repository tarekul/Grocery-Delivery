import axios from "axios";
import apiUrl from "../apiUrl";

export const reOrder = async (orderId, token) => {
  return axios
    .post(
      `${apiUrl}/order/reorder`,
      { orderId },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
