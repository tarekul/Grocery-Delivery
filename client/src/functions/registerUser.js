import axios from "axios";
import apiUrl from "../apiUrl";

export const registerUser = ({ email, password, firstName, lastName }) => {
  return axios
    .post(`${apiUrl}/register`, {
      email,
      password,
      firstName,
      lastName,
    })
    .then((res) => {
      console.log("User registered successfully:", res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};
