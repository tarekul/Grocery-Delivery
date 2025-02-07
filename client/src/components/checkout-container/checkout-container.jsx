import { useState } from "react";
import CheckoutForm from "../checkout-form/checkout-form";
import PriceBreakdown from "../price-breakdown/price-breakdown";
import "./checkout-container.styles.css";

const CheckoutContainer = ({ closeCheckout, cart, setCart }) => {
  const [zipcode, setZipcode] = useState("11416");
  return (
    <div className="checkout-container">
      <CheckoutForm
        closeCheckout={closeCheckout}
        cart={cart}
        setCart={setCart}
        setZipcode={setZipcode}
        zipcode={zipcode}
      />
      {cart.length > 0 && <PriceBreakdown cart={cart} zipcode={zipcode} />}
    </div>
  );
};

export default CheckoutContainer;
