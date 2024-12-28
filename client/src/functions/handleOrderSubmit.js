import axios from 'axios';
import apiUrl from '../apiUrl';

import { refreshCart } from './refreshCart';

export const handleOrderSubmit = ( 
    { 
        firstName, 
        lastName, 
        address, 
        city, 
        state, 
        zipcode, 
        email, 
        phone 
    },
    cart,
    setCart
 ) => {

    const totalPrice = cart.reduce(
        (totalPrice, cartItem) => (totalPrice += cartItem.quantity * cartItem.item.price),
        0
    );

    return axios.post(`${apiUrl}/order`, { firstName, lastName, email, phone, zipcode, address, city, state, totalPrice, items: cart })
    .then(res => {
        console.log(res.data);
        refreshCart();
        setCart([]);
    })
    .catch(err => {
        console.log(err);
    });
};