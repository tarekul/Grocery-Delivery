import calculateCartTotal from "../../functions/calculateCartTotal";
import distanceCalculator from "../../functions/distanceCalculator";
import "./price-breakdown.styles.css";

const PriceBreakdown = ({ cart, zipcode }) => {
  const totalPrice = calculateCartTotal(cart);

  const deliveryFee = distanceCalculator(zipcode);
  const total = totalPrice + deliveryFee;

  return (
    <div className="price-breakdown">
      <h3>Summary</h3>
      <p>
        {`${cart.length} item${cart.length > 1 ? "s" : ""}`}:{" "}
        <span>${totalPrice}</span>
      </p>
      <p>
        Taxes and Fees: <span>$0.00</span>
      </p>
      <p>
        Delivery Fee: <span>${deliveryFee}</span>
      </p>
      <p className="total-price">
        Total: <span>${total.toFixed(2)}</span>
      </p>
    </div>
  );
};

export default PriceBreakdown;
