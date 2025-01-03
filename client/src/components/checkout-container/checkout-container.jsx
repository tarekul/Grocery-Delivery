import './checkout-container.styles.css';
import { handleOrderSubmit }  from '../../functions/handleOrderSubmit.js'
import { useState } from 'react';

const CheckoutContainer = ({setIsCheckoutOpen, cart, setCart}) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [zipcode, setZipcode] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state] = useState('NY');
    const [isInvalidEmail, setIsInvalidEmail] = useState(true);
    const [isInvalidPhone, setIsInvalidPhone] = useState(true);

    let orderTimeout;

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsInvalidEmail(!emailRegex.test(email));
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^\d{10}$/;
        setIsInvalidPhone(!phoneRegex.test(phone));
    };

    const handleOrderConfirm = (e) => {
        e.preventDefault();
        const customer = {
            firstName,
            lastName,
            email,
            phone,
            address,
            city,
            state,
            zipcode
        };

        const orderDetails = { customer, cart };

        alert('Your order is being processed. You have 5 minutes to cancel.');

        orderTimeout = setTimeout(() => {
            handleOrderSubmit(orderDetails.customer, orderDetails.cart, setCart)
                .then(() => {
                    setIsCheckoutOpen(false);
                })
                .catch(err => {
                    console.log(err);
                });
        }, 300000);
    };

    const cancelOrder = () => {
        clearTimeout(orderTimeout);
        alert('Order has been canceled.');
    }

    return (
        <div className="checkout-form">
            <h3>Checkout</h3>
            <div className="name-container">
                <input 
                    className="first-name" 
                    type="text" 
                    placeholder="First name" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
                <input 
                    className="last-name" 
                    type="text" 
                    placeholder="Last name" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
            </div>
            <div className="address-container">
                <input 
                    className="address" 
                    type="text" 
                    placeholder="Address" 
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)}
                />
                <input 
                    className="city" 
                    type="text" 
                    placeholder="City" 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)}
                />
            </div>
            <div className="zip-state-container">
                <input 
                    className="zip" 
                    type="text" 
                    placeholder="Zip"
                    value={zipcode}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 5) { 
                            setZipcode(value);
                        }
                    }} 
                    maxLength={5}
                />
                <input 
                    className="state" 
                    type="text" 
                    placeholder="State" 
                    value={state} 
                    disabled={true} 
                />
            </div>
            <div className="email-phone-container">
                <div className="email-container">
                    <input 
                        className={`email ${isInvalidEmail ? "invalid" : "valid"}`}
                        type="email"  
                        value={email}
                        placeholder="Email"
                        onChange={(e) => {
                            setEmail(e.target.value);
                            validateEmail(e.target.value);
                        }}
                    />
                    {isInvalidEmail && <small style={{ color: "red" }}>Invalid email address</small>}
                </div>
                
                <div className="phone-container">
                    <input 
                        className={`phone ${isInvalidPhone ? "invalid" : "valid"}`} 
                        type="text" 
                        placeholder="Phone Number" 
                        value={phone}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 10) {
                                setPhone(value);
                                validatePhone(value);
                            }
                        }}
                    />
                    {isInvalidPhone && <small style={{ color: "red" }}>Invalid phone number</small>}
                </div>
            </div>
            <button 
                onClick={(e) => handleOrderConfirm(e)} 
                className={`checkout-button ${cart.length === 0 ? "disabled" : ""}`} 
                type="submit"
                disabled={cart.length === 0}>Confirm Order
            </button>
            <button onClick={cancelOrder}>Cancel Order</button>
            <button onClick={() => setIsCheckoutOpen(false)}>Back</button>
            <span className="checkout-info">*Delivery fee is $5.99</span>
            <span className="checkout-info">*We accept only cash on delivery</span>
            <span className="checkout-info">*Delivery time is 1 to 2 hours</span>
        </div>
        
    )
}

export default CheckoutContainer;