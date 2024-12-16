import { useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBasketShopping } from '@fortawesome/free-solid-svg-icons';
import CartItem from "../cart-item/cart-item";
import "./cart.styles.css";

const Cart = ({ cart, editCart, isDropdownOpen, setIsDropdownOpen, setIsCheckoutOpen }) => {
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
    };

    useEffect(() => {
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <div className="cart-container">
            <button className="cart-button" onClick={toggleDropdown}>
                <FontAwesomeIcon icon={faBasketShopping} /> ({cart.length})
            </button>

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
