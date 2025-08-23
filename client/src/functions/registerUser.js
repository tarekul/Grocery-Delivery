import axios from "axios";
import apiUrl from "../apiUrl";

export const registerUser = async ({
  uid,
  email,
  password,
  firstName,
  lastName,
  phone,
  address,
  city,
  state,
  zipcode,
}) => {
  return axios
    .post(`${apiUrl}/register`, {
      uid,
      email,
      password,
      firstName,
      lastName,
      phone,
      address,
      city,
      state,
      zipcode,
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
