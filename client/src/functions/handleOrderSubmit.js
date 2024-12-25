import axios from 'axios';

const apiUrl = 'http://localhost:5001';

export const handleOrderSubmit = ( 
    firstName, 
    lastName, 
    address, 
    city, 
    state, 
    zipcode, 
    email, 
    phone, 
    cart ) => {

    const totalPrice = cart.reduce(
        (totalPrice, cartItem) => (totalPrice += cartItem.quantity * cartItem.item.price),
        0
    );

    return axios.post(`${apiUrl}/order`, { firstName, lastName, email, phone, zipcode, address, city, state, totalPrice, items: cart })
    .then(res => {
        console.log(res.data);
    })
    .catch(err => {
        console.log(err);
    });
};