import axios from "axios";
import apiUrl from "../apiUrl";

const areShoppersAvailable = () => {
  return axios
    .get(`${apiUrl}/shoppers/available`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      throw err;
    });
};

export default areShoppersAvailable;
