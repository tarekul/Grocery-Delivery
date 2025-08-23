import { createUserWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../../firebase-config";
import { registerUser } from "../../functions/registerUser";
import validateEmail from "../../functions/validateEmail";
import validatePhone from "../../functions/validatePhone";
import ZipDropdown from "../zip-dropdown/zip-dropdown.jsx";
import "./register.styles.css";

const Register = ({ setUserType, setShowAuthForm }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [verifyEmail, setVerifyEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [verifyPhone, setVerifyPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state] = useState("NY");
  const [zipcode, setZipcode] = useState("11416");
  const [password, setPassword] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [isInvalidPhone, setIsInvalidPhone] = useState(false);
  const [areFieldsFilled, setAreFieldsFilled] = useState(false);

  useEffect(() => {
    const checkAreFieldsFilled = () => {
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
        isPhoneVerified &&
        password
      );
    };

    setAreFieldsFilled(checkAreFieldsFilled());
  }, [
    firstName,
    lastName,
    email,
    verifyEmail,
    phone,
    verifyPhone,
    zipcode,
    address,
    city,
    isInvalidEmail,
    isInvalidPhone,
    isEmailVerified,
    isPhoneVerified,
    password,
  ]);

  const handleRegister = (e) => {
    e.preventDefault();
    if (!areFieldsFilled) {
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUserType("authenticated");
        registerUser({ email, password, firstName, lastName, phone,address,city,state,zipcode, });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };
  return (
    <div className="register">
      <div className="register-container">
        <h1>Register</h1>
        <form className="register-form" onSubmit={handleRegister}>
          <div className="name-container">
            <input
              className="first-name"
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              className="last-name"
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          <div className="address-container">
            <input
              className="address"
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <input
              className="city"
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="zip-state-container">
            <ZipDropdown setZipcode={setZipcode} />
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
                  setIsInvalidEmail(!validateEmail(newEmail));
                  setIsEmailVerified(verifyEmail === newEmail);
                }}
              />
              <small
                className={isInvalidEmail && email !== "" ? "" : "hidden"}
                style={{ color: "red" }}
              >
                Invalid email address
              </small>
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
              />
              <small
                className={isEmailVerified ? "hidden" : ""}
                style={{ color: "red" }}
              >
                Email Address not matched
              </small>
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
                    setIsInvalidPhone(!validatePhone(value));
                    setIsPhoneVerified(verifyPhone === value);
                  }
                }}
              />
              <small
                className={isInvalidPhone ? "" : "hidden"}
                style={{ color: "red" }}
              >
                Invalid phone number
              </small>
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
              />
              <small
                className={isPhoneVerified ? "hidden" : ""}
                style={{ color: "red" }}
              >
                Phone numbers not matched
              </small>
            </div>
            <div className="password-container">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <button
            className="register-button"
            type="submit"
            disabled={!areFieldsFilled}
          >
            Register
          </button>
        </form>
        <p>
          Already have an account?{" "}
          <button onClick={() => setShowAuthForm("signin")}>Log In</button>
        </p>
        <p>
          Customer Support:{" "}
          <a href="mailto:grocerygo98@gmail.com">grocerygo98@gmail.com</a>
        </p>
      </div>
    </div>
  );
};

export default Register;
