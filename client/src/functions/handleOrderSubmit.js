import axios from "axios";
import apiUrl from "../apiUrl";

import { refreshCart } from "./refreshCart";

export const submitOrder = (
  { firstName, lastName, address, city, state, zipcode, email, phone },
  cart,
  setCart
) => {
  const totalPrice = cart.reduce(
    (totalPrice, cartItem) =>
      (totalPrice += cartItem.quantity * cartItem.item.price),
    0
  );

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
