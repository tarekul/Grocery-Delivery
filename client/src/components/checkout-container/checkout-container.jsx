import { useEffect, useState } from "react";
import ProgressiveBar from "../progress-bar/progress-bar.jsx";
import ZipDropdown from "../zip-dropdown/zip-dropdown.jsx";
import "./checkout-container.styles.css";

const CheckoutContainer = ({ closeCheckout, cart, setOrderStartTime }) => {
  const customer = localStorage.getItem("customer");
  const [firstName, setFirstName] = useState(
    customer ? JSON.parse(customer).firstName : ""
  );
  const [lastName, setLastName] = useState(
    customer ? JSON.parse(customer).lastName : ""
  );
  const [email, setEmail] = useState(
    customer ? JSON.parse(customer).email : ""
  );
  const [verifyEmail, setVerifyEmail] = useState(
    customer ? JSON.parse(customer).verifyEmail : ""
  );
  const [phone, setPhone] = useState(
    customer ? JSON.parse(customer).phone : ""
  );
  const [verifyPhone, setVerifyPhone] = useState(
    customer ? JSON.parse(customer).verifyPhone : ""
  );
  const [zipcode, setZipcode] = useState(
    customer ? JSON.parse(customer).zipcode : "11416"
  );
  const [address, setAddress] = useState(
    customer ? JSON.parse(customer).address : ""
  );
  const [city, setCity] = useState(customer ? JSON.parse(customer).city : "");
  const [state] = useState("NY");
  const [isEmailVerified, setIsEmailVerified] = useState(email === verifyEmail);
  const [isPhoneVerified, setIsPhoneVerified] = useState(phone === verifyPhone);
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [isInvalidPhone, setIsInvalidPhone] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(
    localStorage.getItem("isOrderPlaced") === "true" ?? false
  );
  const [isInputsDisabled, setIsInputsDisabled] = useState(
    isOrderPlaced ?? false
  );
  const [isProgressBarComplete, setIsProgressBarComplete] = useState(false);

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

  const cancelOrderPlaced = () => {
    setIsOrderPlaced(false);
    setIsInputsDisabled(false);
    setOrderStartTime(null);
    localStorage.removeItem("isOrderPlaced");
  };

  useEffect(() => {
    if (cart.length === 0) {
      cancelOrderPlaced();
    }
  }, [cart]);

  useEffect(() => {
    if (isProgressBarComplete && isOrderPlaced) {
      setTimeout(() => {
        closeCheckout();
      }, 6000);
    }
  }, [isProgressBarComplete, isOrderPlaced]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsInvalidEmail(!emailRegex.test(email));
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    setIsInvalidPhone(!phoneRegex.test(phone));
  };

  const saveCustomer = () => {
    const customer = {
      firstName,
      lastName,
      email,
      verifyEmail,
      verifyPhone,
      phone,
      address,
      city,
      state,
      zipcode,
    };
    localStorage.setItem("customer", JSON.stringify(customer));
  };

  const placeOrder = () => {
    setIsInputsDisabled(true);
    setIsOrderPlaced(true);
    localStorage.setItem("isOrderPlaced", true);
    saveCustomer();
  };

  const toggleOrder = (e) => {
    e.preventDefault();

    if (disabled) {
      return;
    }

    if (isOrderPlaced) {
      cancelOrderPlaced();
      return;
    }

    placeOrder();
  };

  return (
    <div className="checkout-form">
      <h3>Checkout</h3>
      <p className="total-price">
        Total:{" "}
        {cart
          .reduce(
            (totalPrice, cartItem) =>
              (totalPrice += cartItem.quantity * cartItem.item.price),
            0
          )
          .toFixed(2)}
      </p>
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

      <ProgressiveBar
        isOrderPlaced={isOrderPlaced}
        setIsProgressBarComplete={setIsProgressBarComplete}
        setOrderStartTime={setOrderStartTime}
      />
      <button
        className={`confirm-button ${disabled ? "disabled" : ""}`}
        onClick={toggleOrder}
      >
        {isOrderPlaced ? "Cancel Order" : "Confirm Order"}
      </button>
      <span className="checkout-info">*Delivery fee is $5.99</span>
      <span className="checkout-info">*We accept only cash on delivery</span>
      <span className="checkout-info">*Delivery time is 1 to 2 hours</span>
    </div>
  );
};

export default CheckoutContainer;
