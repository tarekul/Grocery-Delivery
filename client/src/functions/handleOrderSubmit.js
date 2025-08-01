import axios from "axios";
import apiUrl from "../apiUrl";

import calculateCartTotal from "./calculateCartTotal";
import distanceCalculator from "./distanceCalculator";
import { refreshCart } from "./refreshCart";
import ServiceFee from "./serviceFee";

export const submitOrder = (
  { firstName, lastName, address, city, state, zipcode, email, phone },
  cart,
  setCart
) => {
  const totalPrice =
    calculateCartTotal(cart) + distanceCalculator(zipcode) + ServiceFee;
  console.log(cart);

  return axios
    .post(`${apiUrl}/order`, {
      firstName,
      lastName,
      email,
      phone,
      zipcode,
      address,
      city,
      state,
      totalPrice,
      items: cart,
    })
    .then((res) => {
      refreshCart();
      setCart([]);
      console.log("Order placed successfully:", res.data);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};
