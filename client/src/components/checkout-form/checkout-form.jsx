import { useEffect, useState } from "react";
import { submitOrder } from "../../functions/handleOrderSubmit";
import validateEmail from "../../functions/validateEmail";
import validatePhone from "../../functions/validatePhone";
import LoadingIcon from "../loading-icon/loading-icon.jsx";
import OrderToast from "../toast/order-toast.jsx";
import ZipDropdown from "../zip-dropdown/zip-dropdown.jsx";
import "./checkout-form.styles.css";

const CheckoutForm = ({
  setActiveView,
  cart,
  setCart,
  setZipcode,
  zipcode,
  isShoppersAvailable,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [verifyPhone, setVerifyPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state] = useState("NY");
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [isInvalidPhone, setIsInvalidPhone] = useState(false);
  const [isInputsDisabled, setIsInputsDisabled] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [isOrderComplete, setIsOrderComplete] = useState(false);

  const isPhoneVerified = phone === verifyPhone;

  const areFieldsFilled = () => {
    return (
      firstName &&
      lastName &&
      email &&
      phone &&
      zipcode &&
      address &&
      city &&
      !isInvalidEmail &&
      !isInvalidPhone &&
      isPhoneVerified
    );
  };

  const disabled = cart.length === 0 || !areFieldsFilled();

  useEffect(() => {
    if (cart.length === 0) {
      setIsInputsDisabled(false);
    }
  }, [cart]);

  useEffect(() => {
    let timeoutId;
    if (isOrderComplete) {
      timeoutId = setTimeout(() => {
        setActiveView("home");
      }, 4000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isOrderComplete, setActiveView]);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();

    if (disabled) {
      return;
    }

    try {
      setIsInputsDisabled(true);
      setIsProcessingOrder(true);
      const response = await submitOrder(
        {
          firstName,
          lastName,
          address,
          city,
          state,
          zipcode,
          email,
          phone,
        },
        cart,
        setCart
      );
      setIsProcessingOrder(false);
      setIsOrderComplete(true);
      localStorage.setItem("orderId", response.orderId);
      setIsInputsDisabled(false);
    } catch (error) {
      console.error("Failed to place order:", error);
      setIsInputsDisabled(false);
      setIsProcessingOrder(false);
    }
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
          disabled={isInputsDisabled}
        />
        <input
          className="last-name"
          type="text"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          disabled={isInputsDisabled}
        />
      </div>
      <div className="address-container">
        <input
          className="address"
          type="text"
          placeholder="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={isInputsDisabled}
        />
        <input
          className="city"
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          disabled={isInputsDisabled}
        />
      </div>
      <div className="zip-state-container">
        <ZipDropdown setZipcode={setZipcode} disabled={isInputsDisabled} />
        <span className="state-display">{state}</span>
      </div>

      <div className="email-container">
        <input
          className={`email ${isInvalidEmail ? "invalid" : "valid"}`}
          type="email"
          value={email}
          placeholder="email"
          onChange={(e) => {
            const newEmail = e.target.value;
            setEmail(newEmail);
            setIsInvalidEmail(!validateEmail(newEmail));
          }}
          disabled={isInputsDisabled}
        />
        <small
          className={isInvalidEmail && email !== "" ? "" : "hidden"}
          style={{ color: "red" }}
        >
          Invalid email address
        </small>
      </div>

      <div className="phone-container">
        <div className="phone-input-container">
          <input
            className={`phone ${isInvalidPhone ? "invalid" : "valid"}`}
            type="tel"
            name="phone"
            placeholder="phone number"
            value={phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 10) {
                setPhone(value);
                setIsInvalidPhone(!validatePhone(value));
              }
            }}
            disabled={isInputsDisabled}
          />
          <small
            className={isInvalidPhone ? "" : "hidden"}
            style={{ color: "red" }}
          >
            Invalid phone number
          </small>
        </div>
        <div
          className={`phone-input-container ${
            !validatePhone(phone) ? "hidden" : ""
          }`}
        >
          <input
            className={`phone ${
              verifyPhone === "" ? "" : !isPhoneVerified ? "invalid" : "valid"
            }`}
            type="tel"
            name="verifyPhone"
            placeholder="confirm phone"
            value={verifyPhone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 10) {
                setVerifyPhone(value);
              }
            }}
            disabled={isInputsDisabled}
          />
          <small
            className={isPhoneVerified || verifyPhone === "" ? "hidden" : ""}
            style={{ color: "red" }}
          >
            Phone numbers not matched
          </small>
        </div>
      </div>
      {isProcessingOrder ? (
        <LoadingIcon />
      ) : (
        isShoppersAvailable && (
          <button
            className={`confirm-button ${disabled ? "disabled" : ""}`}
            onClick={handleSubmitOrder}
            disabled={disabled}
          >
            Confirm Order
          </button>
        )
      )}
      {!isShoppersAvailable && (
        <div className="shoppers-not-available">
          <p>Shoppers are not available at the moment.</p>
          <p>Please try again later.</p>
        </div>
      )}
      {isOrderComplete && (
        <OrderToast onClose={() => setIsOrderComplete(false)} />
      )}
    </div>
  );
};

export default CheckoutForm;
