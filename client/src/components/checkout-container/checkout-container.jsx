import { useEffect, useState } from "react";
import { handleOrderSubmit } from "../../functions/handleOrderSubmit";
import ProgressiveBar from "../progress-bar/progress-bar.jsx";
import ZipDropdown from "../zip-dropdown/zip-dropdown.jsx";
import "./checkout-container.styles.css";

const CheckoutContainer = ({ closeCheckout, cart, setCart }) => {
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
  const [phone, setPhone] = useState(
    customer ? JSON.parse(customer).phone : ""
  );
  const [zipcode, setZipcode] = useState(
    customer ? JSON.parse(customer).zipcode : "11416"
  );
  const [address, setAddress] = useState(
    customer ? JSON.parse(customer).address : ""
  );
  const [city, setCity] = useState(customer ? JSON.parse(customer).city : "");
  const [state] = useState("NY");
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
      !isInvalidPhone
    );
  };

  const submitOrder = () => {
    const customer = {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zipcode,
    };

    const orderDetails = { customer, cart };

    handleOrderSubmit(orderDetails.customer, orderDetails.cart, setCart)
      .then(() => {
        setIsOrderPlaced(false);
        localStorage.setItem("isOrderPlaced", false);
        closeCheckout();
        setIsInputsDisabled(false);
        setIsProgressBarComplete(false);
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setZipcode("");
        setAddress("");
        setCity("");
        setIsInvalidEmail(true);
        setIsInvalidPhone(true);

        localStorage.removeItem("customer");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const disabled = cart.length === 0 || !areFieldsFilled();

  useEffect(() => {
    if (cart.length === 0) {
      setIsInputsDisabled(false);
      setIsOrderPlaced(false);
      localStorage.setItem("isOrderPlaced", false);
    }
  }, [cart]);

  useEffect(() => {
    if (isProgressBarComplete && isOrderPlaced) {
      submitOrder();
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

  const toggleOrder = (e) => {
    e.preventDefault();

    if (disabled) {
      return;
    }

    if (isOrderPlaced) {
      setIsOrderPlaced(false);
      setIsInputsDisabled(false);
      localStorage.removeItem("isOrderPlaced");
      return;
    }

    setIsInputsDisabled(true);
    setIsOrderPlaced(true);
    localStorage.setItem("isOrderPlaced", true);

    const customer = {
      firstName,
      lastName,
      email,
      phone,
      address,
      city,
      state,
      zipcode,
    };
    localStorage.setItem("customer", JSON.stringify(customer));
  };

  return (
    <div className="checkout-form">
      <h3>Checkout</h3>
      <p className="total-price">
        Total:{" "}
        {cart.reduce(
          (totalPrice, cartItem) =>
            (totalPrice += cartItem.quantity * cartItem.item.price),
          0
        )}
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
      <div className="email-phone-container">
        <div className="email-container">
          <input
            className={`email ${isInvalidEmail ? "invalid" : "valid"}`}
            type="email"
            value={email}
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
              validateEmail(e.target.value);
            }}
            disabled={isInputsDisabled}
          />
          {isInvalidEmail && (
            <small style={{ color: "red" }}>Invalid email address</small>
          )}
        </div>

        <div className="phone-container">
          <input
            className={`phone ${isInvalidPhone ? "invalid" : "valid"}`}
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 10) {
                setPhone(value);
                validatePhone(value);
              }
            }}
            disabled={isInputsDisabled}
          />
          {isInvalidPhone && (
            <small style={{ color: "red" }}>Invalid phone number</small>
          )}
        </div>
      </div>
      <ProgressiveBar
        isOrderPlaced={isOrderPlaced}
        setIsProgressBarComplete={setIsProgressBarComplete}
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
