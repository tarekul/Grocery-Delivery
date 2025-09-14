import axios from "axios";
import apiUrl from "../apiUrl";

import calculateCartTotal from "./calculateCartTotal";
import distanceCalculator from "./distanceCalculator";
import { refreshCart } from "./refreshCart";
import ServiceFee from "./serviceFee";

export const submitOrder = (
  { firstName, lastName, address, city, state, zipcode, email, phone },
  cart,
  setCart,
  customerId
) => {
  const subTotal = calculateCartTotal(cart);
  const tax = 0;
  const serviceFee = ServiceFee;
  const deliveryFee = distanceCalculator(zipcode);
  const totalPrice = subTotal + tax + serviceFee + deliveryFee;

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
      subTotal,
      tax,
      serviceFee,
      deliveryFee,
      totalPrice,
      items: cart,
      customerId,
    })
    .then((res) => {
      refreshCart();
      setCart([]);
      return res.data;
    })
    .catch((err) => {
      console.log(err);
      return err;
    });
};
