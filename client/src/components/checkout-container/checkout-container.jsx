import { useState } from "react";
import { useCart } from "../../contexts/cartContext";
import { useUI } from "../../contexts/UIContext";
import CheckoutForm from "../checkout-form/checkout-form";
import PriceBreakdown from "../price-breakdown/price-breakdown";
import "./checkout-container.styles.css";

const CheckoutContainer = () => {
  const { cart, setCart } = useCart();
  const { closeCheckout, isShoppersAvailable } = useUI();
  const [zipcode, setZipcode] = useState("11416");

  return (
    <div className="checkout-container">
      <CheckoutForm
        closeCheckout={closeCheckout}
        cart={cart}
        setCart={setCart}
        setZipcode={setZipcode}
        zipcode={zipcode}
        isShoppersAvailable={isShoppersAvailable}
      />
      {cart.length > 0 && <PriceBreakdown cart={cart} zipcode={zipcode} />}
    </div>
  );
};

export default CheckoutContainer;
