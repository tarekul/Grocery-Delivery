import './checkout-container.styles.css';
import { handleOrderSubmit }  from '../../functions/handleOrderSubmit.js'
import { useState } from 'react';

const CheckoutContainer = ({setIsCheckoutOpen, cart}) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state] = useState('NY');
    const [isInvalidEmail, setIsInvalidEmail] = useState(true);
    const [isInvalidPhone, setIsInvalidPhone] = useState(true);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setIsInvalidEmail(!emailRegex.test(email));
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^\d{10}$/;
        setIsInvalidPhone(!phoneRegex.test(phone));
    };

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
                    value={zipCode}
                    onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length <= 5) { 
                            setZipCode(value);
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
                            setPhone(e.target.value);
                            validatePhone(e.target.value);
                        }}
                    />
                    {isInvalidPhone && <small style={{ color: "red" }}>Invalid phone number</small>}
                </div>
            </div>
            <button 
                onClick={(e) => {
                    e.preventDefault();
                    handleOrderSubmit(
                        firstName, 
                        lastName, 
                        address, 
                        city, 
                        state, 
                        zipCode, 
                        email, 
                        phone, 
                        cart);  
                }} 
                className={`checkout-button ${cart.length === 0 ? "disabled" : ""}`} 
                type="submit"
                disabled={cart.length === 0}>Confirm Order</button>
                <button onClick={() => setIsCheckoutOpen(false)}>Back</button>
                <span className="checkout-info">*Delivery fee is $5.99</span>
                <span className="checkout-info">*We accept only cash on delivery</span>
                <span className="checkout-info">*Delivery time is 1 to 2 hours</span>
        </div>
        
    )
}

export default CheckoutContainer;