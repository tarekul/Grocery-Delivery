import { useState } from "react";
import { useCart } from "../../contexts/cartContext";
import { useUI } from "../../contexts/UIContext";
import CheckoutForm from "../checkout-form/checkout-form";
import PriceBreakdown from "../price-breakdown/price-breakdown";
import "./checkout-container.styles.css";

const CheckoutContainer = () => {
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const { cart, setCart } = useCart();
  const { closeCheckout, isShoppersAvailable, setIsDropdownOpen } = useUI();
  const [zipcode, setZipcode] = useState("11416");

  const isMobile = window.innerWidth <= 820;

  const handleOpenCart = () => {
    setIsDropdownOpen(true);
  };

  return (
    <div className="checkout-container">
      {(!isMobile || !showPriceBreakdown) && (
        <CheckoutForm
          closeCheckout={closeCheckout}
          cart={cart}
          setCart={setCart}
          setZipcode={setZipcode}
          zipcode={zipcode}
          isShoppersAvailable={isShoppersAvailable}
        />
      )}
      {cart.length > 0 && (
        <button
          className="mobile-price-button"
          onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
        >
          {showPriceBreakdown ? "Back to Checkout" : "View Price Breakdown"}
        </button>
      )}
      {cart.length > 0 && (!isMobile || showPriceBreakdown) && (
        <PriceBreakdown cart={cart} zipcode={zipcode} />
      )}
    </div>
  );
};

export default CheckoutContainer;
