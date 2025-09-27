import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../firebase-config";
import { registerUser } from "../../functions/registerUser";
import validateEmail from "../../functions/validateEmail.js";
import validatePhone from "../../functions/validatePhone";
import ZipDropdown from "../zip-dropdown/zip-dropdown.jsx";
import "./register.styles.css";

const Register = ({ setShowAuthForm}) => {
  const [errorMsg, setErrorMsg] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [verifyPhone, setVerifyPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state] = useState("NY");
  const [zipcode, setZipcode] = useState("11416");
  const [password, setPassword] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isInvalidEmail, setIsInvalidEmail] = useState(false);
  const [isInvalidPhone, setIsInvalidPhone] = useState(false);
  const [emailTaken, setEmailTaken] = useState(false);

  const areFieldsFilled =
    firstName &&
    lastName &&
    email &&
    phone &&
    zipcode &&
    address &&
    city &&
    !isInvalidEmail &&
    !isInvalidPhone &&
    isPhoneVerified &&
    password;

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!areFieldsFilled) {
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await registerUser({
        uid: user.uid,
        email,
        firstName,
        lastName,
        phone,
        address,
        city,
        state,
        zipcode,
      });
    } catch (err) {
  console.error("Registration error:", err?.code);
  
  const code = err?.code || ""; // <-- use Firebase error code
  // Map codes to user-facing messages
  const friendly = {
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/network-request-failed": "Network error. Please try again.",
  };
  console.log(friendly[code])
  setErrorMsg(friendly[code] || "Registration failed. Please try again.");
  setEmailTaken(code === "auth/email-already-in-use");
  // Optional: rollback only if a user was actually created
  if (auth.currentUser && code !== "auth/email-already-in-use") {
    try {
      await auth.currentUser.delete();
      console.log("Rolled back user creation due to failure in registerUser");
    } catch (deleteError) {
      console.error("Failed to delete user after registration failure:", deleteError);
    }
  }
}
};

  return (
   <div className="register-form">
  <h1>Register</h1>

  {/* Top banner that always takes space */}
  <div
    className="form-banner"
    role="alert"
    aria-live="polite"
  >
    {errorMsg || "\u00A0" /* non-breaking space keeps height when empty */}
  </div>
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
        <span className="state-display">{state}</span>
      </div>

<div className="email-container">
  <input
    className={`email ${
      emailTaken || isInvalidEmail ? "invalid" : email.trim() === "" ? "" : "valid"
    }`}
    type="email"
    autoComplete="email"
    aria-invalid={emailTaken || isInvalidEmail}
    aria-describedby="email-help"
    value={email}
    placeholder="email"
    onChange={(e) => {
      const newEmail = e.target.value;
      setEmail(newEmail);
      setIsInvalidEmail(!validateEmail(newEmail));
      setEmailTaken(false);     
      if (errorMsg) setErrorMsg("");    
}}
  />
  <small
    id="email-help"
    className={emailTaken ? "" : isInvalidEmail && email !== "" ? "" : "hidden"}
    style={{ color: "red" }}
  >
    {emailTaken ? "An account with this email already exists." : "Invalid email address"}
  </small>
</div>

      <div className="phone-container">
        <div className="phone-input-container">
          <input
            className={`phone ${
              isInvalidPhone ? "invalid" : phone.trim() === "" ? "" : "valid"
            }`}
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
            className={`phone ${
              verifyPhone.trim() === ""
                ? ""
                : !isPhoneVerified
                ? "invalid"
                : "valid"
            }`}
            type="tel"
            name="verifyPhone"
            placeholder="confirm phone"
            value={verifyPhone}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "");
              if (value.length <= 10) {
                setVerifyPhone(value);
                setIsPhoneVerified(value.trim() === phone.trim());
              }
            }}
          />
          <small
            className={
              isPhoneVerified || verifyPhone.trim() === "" ? "hidden" : ""
            }
            style={{ color: "red" }}
          >
            Phone numbers not matched
          </small>
        </div>
      </div>

      <div className="password-container">
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        className="register-button"
        onClick={handleRegister}
        disabled={!areFieldsFilled}
      >
        Register
      </button>

      <p>
        Already have an account?{" "}
        <button onClick={() => setShowAuthForm("signin")}>Log In</button>
      </p>
      <p>
        Customer Support:{" "}
        <a href="mailto:grocerygo98@gmail.com">grocerygo98@gmail.com</a>
      </p>
    </div>
  );
};

export default Register;
