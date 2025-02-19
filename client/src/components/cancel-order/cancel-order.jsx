import { useState } from "react";
import { cancelOrder } from "../../functions/cancelOrder";
import LoadingIcon from "../loading-icon/loading-icon";
import "./cancel-order.styles.css";

const CancelOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsInvalidEmail(!emailRegex.test(email));
  };

  const disabled = isInvalidEmail || !email || orderId.length < 1;

  const handleCancelOrder = async () => {
    if (!disabled) {
      setIsLoading(true);
      try {
        const res = await cancelOrder(orderId, email);
        setMessage(res);
        setIsError(false);
        setEmail("");
        setOrderId("");
        localStorage.removeItem("orderId");
      } catch (error) {
        if (error.response) {
          if (
            error.response.status === 409 ||
            error.response.status === 404 ||
            error.response.status === 403
          ) {
            setMessage(error.response.data);
            setIsError(true);
          } else {
            setMessage("An unexpected error occurred.");
            setIsError(true);
          }
        } else {
          setMessage("An unexpected error occurred.");
          setIsError(true);
        }

        setIsLoading(false);
      }
    }
  };

  const handleFocus = () => {
    if (orderId === "") {
      setOrderId(localStorage.getItem("orderId") ?? "");
    }
  };

  return (
    <div className="cancel-order-container">
      <div className="cancel-order-instructions">
        <h3>Cancel Your Order</h3>
        <p>
          An order can only be cancelled up to <strong>10 minutes</strong> after
          it was placed.
        </p>
        <p>
          You can find your <strong>Order ID</strong> in the order summary
          provided in the email after your order was placed.
        </p>
        <p>
          <em>Tip: Please ensure you have your order ID ready.</em>
        </p>
      </div>
      <div className="cancel-order-form">
        <input
          className={`email ${isInvalidEmail ? "invalid" : "valid"}`}
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            validateEmail(e.target.value);
          }}
          autoComplete="email"
        />
        <input
          className="order-id"
          type="text"
          placeholder={localStorage.getItem("orderId") ?? "order ID"}
          value={orderId}
          onFocus={handleFocus}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 25) {
              setOrderId(value);
            }
          }}
        />
        <button
          className={`cancel-order-button ${disabled ? "disabled" : ""}`}
          disabled={disabled}
          onClick={handleCancelOrder}
        >
          Cancel Order
        </button>
      </div>
      {message ? (
        <div className={`message ${isError ? "error" : ""}`}>{message}</div>
      ) : (
        isLoading && (
          <div className="cancel-order-loading-icon">
            <LoadingIcon />
          </div>
        )
      )}
      <div className="additional-info">
        <p>
          If you have any questions about your order, please contact our support
          team.
        </p>
      </div>
    </div>
  );
};

export default CancelOrder;
