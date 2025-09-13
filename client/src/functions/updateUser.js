import axios from "axios";
import apiUrl from "../apiUrl";

export const updateUser = async (
  uid,
  { firstName, lastName, address, zipcode, city, phone, photoURL }
) => {
  try {
    if (!uid) {
      throw new Error("UID is required to update a user");
    }

    const body = { uid };
    if (firstName !== undefined) body.firstName = firstName;
    if (lastName !== undefined) body.lastName = lastName;
    if (address !== undefined) body.address = address;
    if (zipcode !== undefined) body.zipcode = zipcode;
    if (city !== undefined) body.city = city;
    if (phone !== undefined) body.phone = phone;
    if (photoURL !== undefined) body.photoURL = photoURL;


    const response = await axios.put(`${apiUrl}/update-user`, body);
    return response.data;
  } catch (error) {
    throw error;
  }
};
