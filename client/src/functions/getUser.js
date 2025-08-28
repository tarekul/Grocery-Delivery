import axios from "axios";
import apiUrl from "../apiUrl";

export const getUser = async (uid) => {
  return axios
    .get(`${apiUrl}/user?uid=${uid}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};
