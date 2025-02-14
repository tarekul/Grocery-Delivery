import calculateCartTotal from "../../functions/calculateCartTotal";
import distanceCalculator from "../../functions/distanceCalculator";
import serviceFee from "../../functions/serviceFee";
import "./price-breakdown.styles.css";

const PriceBreakdown = ({ cart, zipcode }) => {
  const totalPrice = calculateCartTotal(cart);

  const deliveryFee = distanceCalculator(zipcode);
  const total = totalPrice + deliveryFee + serviceFee;

  return (
    <div className="price-breakdown">
      <h3>Summary</h3>
      <p>
        {`${cart.length} item${cart.length > 1 ? "s" : ""}`}:{" "}
        <span>${totalPrice}</span>
      </p>
      <p>
        Service Fee: <span>${serviceFee.toFixed(2)}</span>
      </p>
      <p>
        Taxes and Fees: <span>$0.00</span>
      </p>
      <p>
        Delivery Fee: <span>${deliveryFee.toFixed(2)}</span>
      </p>
      <hr />
      <p className="total-price">
        Total: <span>${total.toFixed(2)}</span>
      </p>
    </div>
  );
};

export default PriceBreakdown;
