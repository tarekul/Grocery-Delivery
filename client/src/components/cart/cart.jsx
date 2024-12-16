import { useEffect } from "react";
import CartItem from "../cart-item/cart-item";
import "./cart.styles.css";

const Cart = ({ cart, editCart, isDropdownOpen, setIsDropdownOpen, setIsCheckoutOpen }) => {
    const totalPrice = cart.reduce(
        (totalPrice, cartItem) => (totalPrice += cartItem.quantity * cartItem.item.price),
        0
    );

    const hasItems = cart.length > 0 ? 'has-items' : '';

    const toggleDropdown = () => {
        if (!isDropdownOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        setIsDropdownOpen(!isDropdownOpen);
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
            {/* Cart Icon/Button */}
            <button className="cart-button" onClick={toggleDropdown}>
                Cart ({cart.length})
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className={`cart-dropdown ${hasItems}`}>
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
