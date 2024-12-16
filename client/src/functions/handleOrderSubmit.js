import axios from 'axios';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';

export const handleOrderSubmit = (dependencies) => {
    const { cart, form, setCart, setForm } = dependencies;
    
    return (e) => {
        e.preventDefault();
        axios.post(`${apiUrl}/order`, { ...form, items: cart })
        .then(res => {
            console.log(res.data);
            setCart([]);
            setForm({ name: '', phone: '', address: '' });
        })
        .catch(err => {
            console.log(err);
        });
    };
};