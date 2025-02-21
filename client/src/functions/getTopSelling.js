import axios from "axios";
import apiUrl from "../apiUrl";

export const getTopSelling = async () => {
  return axios
    .get(`${apiUrl}/top-selling-items`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
