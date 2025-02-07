import { useEffect, useState } from "react";
import calculateCartTotal from "../../functions/calculateCartTotal";
import distanceCalculator from "../../functions/distanceCalculator";
import { submitOrder } from "../../functions/handleOrderSubmit";
import LoadingIcon from "../loading-icon/loading-icon.jsx";
import OrderToast from "../toast/order-toast.jsx";
import ZipDropdown from "../zip-dropdown/zip-dropdown.jsx";
import "./checkout-form.styles.css";

const CheckoutForm = ({
  closeCheckout,
  cart,
  setCart,
  setZipcode,
  zipcode,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [verifyEmail, setVerifyEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [verifyPhone, setVerifyPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state] = useState("NY");
  const [isEmailVerified, setIsEmailVerified] = useState(email === verifyEmail);
  const [isPhoneVerified, setIsPhoneVerified] = useState(phone === verifyPhone);
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [isInvalidPhone, setIsInvalidPhone] = useState(false);
  const [isInputsDisabled, setIsInputsDisabled] = useState(false);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [isOrderComplete, setIsOrderComplete] = useState(false);

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
      isEmailVerified &&
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
        closeCheckout();
      }, 4000);
    }
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isOrderComplete]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsInvalidEmail(!emailRegex.test(email));
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    setIsInvalidPhone(!phoneRegex.test(phone));
  };

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
      {cart.length > 0 && (
        <p className="total-price">
          Total: ${distanceCalculator(zipcode) + calculateCartTotal(cart)}
        </p>
      )}
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
        <input
          className="state"
          type="text"
          placeholder="State"
          value={state}
          disabled={true}
        />
      </div>

      <div className="email-container">
        <div className="email-input-container">
          <input
            className={`email ${isInvalidEmail ? "invalid" : "valid"}`}
            type="email"
            value={email}
            placeholder="email"
            onChange={(e) => {
              const newEmail = e.target.value;
              setEmail(newEmail);
              validateEmail(newEmail);
              setIsEmailVerified(verifyEmail === newEmail);
            }}
            disabled={isInputsDisabled}
          />
          {isInvalidEmail && email !== "" && (
            <small style={{ color: "red" }}>Invalid email address</small>
          )}
        </div>
        <div className="email-input-container">
          <input
            className={`email ${!isEmailVerified ? "invalid" : "valid"}`}
            type="email"
            value={verifyEmail}
            placeholder="verify email"
            onChange={(e) => {
              const newVerifyEmail = e.target.value;
              setVerifyEmail(newVerifyEmail);
              setIsEmailVerified(newVerifyEmail === email);
            }}
            disabled={isInputsDisabled}
          />
          {!isEmailVerified && (
            <small style={{ color: "red" }}>Email Address not matched</small>
          )}
          {isEmailVerified && verifyEmail !== "" && (
            <small style={{ color: "green" }}>Email Address matched</small>
          )}
        </div>
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
                validatePhone(value);
                setIsPhoneVerified(verifyPhone === value);
              }
            }}
            disabled={isInputsDisabled}
          />
          {isInvalidPhone && phone !== "" && (
            <small style={{ color: "red" }}>Invalid phone number</small>
          )}
        </div>
        <div className="phone-input-container">
          <input
            className={`phone ${!isPhoneVerified ? "invalid" : "valid"}`}
            type="tel"
            name="verifyPhone"
            placeholder="verify phone number"
            value={verifyPhone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 10) {
                setVerifyPhone(value);
                setIsPhoneVerified(value === phone);
              }
            }}
            disabled={isInputsDisabled}
          />
          {isPhoneVerified && phone !== "" && (
            <small style={{ color: "green" }}>Phone numbers matched</small>
          )}
          {!isPhoneVerified && (
            <small style={{ color: "red" }}>Phone numbers not matched</small>
          )}
        </div>
      </div>
      {isProcessingOrder ? (
        <LoadingIcon />
      ) : (
        <button
          className={`confirm-button ${disabled ? "disabled" : ""}`}
          onClick={handleSubmitOrder}
          disabled={disabled}
        >
          Confirm Order
        </button>
      )}
      {isOrderComplete && (
        <OrderToast onClose={() => setIsOrderComplete(false)} />
      )}
    </div>
  );
};

export default CheckoutForm;
