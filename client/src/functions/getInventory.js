import axios from "axios";
import apiUrl from "../apiUrl";

export const getInventory = () => {
  return axios
    .get(`${apiUrl}/inventory`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
