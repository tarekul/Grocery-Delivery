import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../firebase-config";
import { registerUser } from "../../functions/registerUser";
import validateEmail from "../../functions/validateEmail.js";
import validatePhone from "../../functions/validatePhone";
import ZipDropdown from "../zip-dropdown/zip-dropdown.jsx";
import "./register.styles.css";

const Register = ({ setShowAuthForm, setIsRegistering }) => {
  const [errorMsg, setErrorMsg] = useState("");
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
    isEmailVerified &&
    isPhoneVerified &&
    password;

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!areFieldsFilled) {
      return;
    }

    setIsRegistering(true);

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
    } catch (error) {
      console.error("Registration error:", error?.message);
      if (error?.message === "Firebase: Error (auth/email-already-in-use).") {
        setErrorMsg("Email already in use");
        return;
      }

      if (error?.message === "Firebase: Error (auth/invalid-email).") {
        setErrorMsg("Invalid email");
        return;
      }

      if (error?.message === "Firebase: Error (auth/weak-password).") {
        setErrorMsg("Weak password");
        return;
      }

      if (
        error?.message ===
        "Firebase: Password should be at least 6 characters (auth/weak-password)."
      ) {
        setErrorMsg("Password should be at least 6 characters");
        return;
      }

      // Rollback if Firestore write failed after user was created
      if (auth.currentUser) {
        try {
          await auth.currentUser.delete();
          setErrorMsg("Registration failed. Please try again.");
          console.log(
            "Rolled back user creation due to failure in registerUser"
          );
        } catch (deleteError) {
          console.error(
            "Failed to delete user after registration failure:",
            deleteError
          );
        } finally {
          setIsRegistering(false);
        }
      }
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="register-form">
      <h1>Register</h1>
      {/* Error message block */}
      {errorMsg && (
        <p style={{ color: "red", fontSize: "0.9rem", marginBottom: "10px" }}>
          {errorMsg}
        </p>
      )}
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
            placeholder="verify phone number"
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

      <div className="email-container">
        <div className="email-input-container">
          <input
            className={`email ${
              isInvalidEmail ? "invalid" : email.trim() === "" ? "" : "valid"
            }`}
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
            className={`email ${
              verifyEmail.trim() === ""
                ? ""
                : !isEmailVerified
                ? "invalid"
                : "valid"
            }`}
            type="email"
            value={verifyEmail}
            placeholder="verify email"
            onChange={(e) => {
              const newVerifyEmail = e.target.value;
              setVerifyEmail(newVerifyEmail);
              setIsEmailVerified(
                newVerifyEmail.trim().toLowerCase() ===
                  email.trim().toLowerCase()
              );
            }}
          />
          <small
            className={
              isEmailVerified || verifyEmail.trim() === "" ? "hidden" : ""
            }
            style={{ color: "red" }}
          >
            Email Address not matched
          </small>
        </div>
      </div>
      <div className="password-container">
        <input
          type="password"
          placeholder="Password"
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
