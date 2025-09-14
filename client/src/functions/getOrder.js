import axios from "axios";
import apiUrl from "../apiUrl";

const getOrder = async (orderId) => {
  return axios
    .get(`${apiUrl}/order/${orderId}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export default getOrder;
