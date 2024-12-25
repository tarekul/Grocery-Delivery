import { useEffect, useState } from "react";
import CartItem from "../cart-item/cart-item";

import "./cart.styles.css";
import CartButton from "../card-button/cart-button";

const Cart = ({ cart, editCart, isDropdownOpen, setIsDropdownOpen, setIsCheckoutOpen, isSearchBarActive }) => {
    const [isClosing, setIsClosing] = useState(false);
    
    const totalPrice = cart.reduce(
        (totalPrice, cartItem) => (totalPrice += cartItem.quantity * cartItem.item.price),
        0
    );

    const hasItems = cart.length > 0 ? 'has-items' : '';

    const toggleDropdown = () => {
        if (isDropdownOpen) {
            setIsClosing(true);
            document.body.style.overflow = 'unset';
            setTimeout(() => {
                setIsClosing(false);
                setIsDropdownOpen(false);
            }, 500);
        } else {
            setIsDropdownOpen(true);
            document.body.style.overflow = 'hidden';
        }
    };

    const toggleCheckout = () => {
        setIsCheckoutOpen(true);
        setIsDropdownOpen(false);
        document.body.style.overflow = 'unset';
    };

    useEffect(() => {
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    useEffect(() => {
        if (cart.length > 0) {
            const badge = document.querySelector('.cart-badge');
            badge.style.animation = 'none';

            // Force a reflow to trigger the animation
            void badge.offsetWidth;
            badge.style.animation = 'badgeBounce 0.3s ease-in-out';
        }
    }, [cart.length]);

    return (
        <div className="cart-container">
            <CartButton cart={cart} toggleDropdown={toggleDropdown} isSearchBarActive={isSearchBarActive} />

            {isDropdownOpen && (
                <div className={`cart-dropdown ${isClosing ? 'closing' : ''} ${hasItems}`}>
                    <h2>Your Cart</h2>
                    <button className="close-button" onClick={toggleDropdown}>X</button>
                    <p className="total-price">Total: ${totalPrice.toFixed(2)}</p>
                    {cart.length > 0 ? (
                        <div className="cart-items">
                            {cart.map((cartItem) => (
                                <CartItem
                                    key={cartItem.item.id}
                                    cartItem={cartItem}
                                    editCart={editCart}
                                />
                            ))}
                            <button className="checkout-button" onClick={toggleCheckout}>Checkout</button>
                        </div>
                    ) : (
                        <p>Your cart is empty</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Cart;
