import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import { auth, googleProvider } from "../../firebase-config";
import "./sign-in.styles.css";

const SignIn = ({ setUserType, setShowAuthForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMsg("");

    signInWithEmailAndPassword(auth, email, password).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
      setErrorMsg("Invalid email or password.");
    });
  };

  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    try {
      await signInWithPopup(auth, googleProvider);
      // Optionally set user type or close auth form here:
      // setUserType("customer");
      // setShowAuthForm(null);
    } catch (error) {
      console.error("Google login error:", error);

      if (error?.code === "auth/popup-closed-by-user") {
        setErrorMsg("Google sign-in popup was closed before finishing.");
        return;
      }

      if (error?.code === "auth/account-exists-with-different-credential") {
        setErrorMsg(
          "An account already exists with the same email. Log in with email/password first, then link Google from your profile."
        );
        return;
      }

      setErrorMsg("Google sign-in failed. Please try again.");
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      alert("Please enter your email first.");
      return;
    }

    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Password reset email sent! Check your inbox.");
      })
      .catch((error) => {
        console.error(error.code, error.message);
        alert("Error sending password reset email: " + error.message);
      });
  };

  return (
    <div className="sign-in">
      <div className="login-container">
        <h1>Log In</h1>

        {errorMsg && (
          <p style={{ color: "red", fontSize: "0.9rem", marginBottom: "10px" }}>
            {errorMsg}
          </p>
        )}

        <form className="login-form" onSubmit={handleLogin}>
          <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="login-button" type="submit">
            Log In
          </button>
        </form>

        {/* Divider & Google button */}
        <div className="divider">
          <span>or</span>
        </div>

        <button
          type="button"
          className="google-button"
          onClick={handleGoogleLogin}
        >
          Continue with Google
        </button>

        <p>
          Don't have an account?{" "}
          <button onClick={() => setShowAuthForm("register")}>Register</button>
        </p>
        <p>
          Forgot Password?{" "}
          <button onClick={handleForgotPassword}>Forgot Password</button>
        </p>
        <p>
          Customer Support:{" "}
          <a href="mailto:grocerygo98@gmail.com">grocerygo98@gmail.com</a>
        </p>
      </div>
      <div className="guest-container">
        <button onClick={() => setUserType("guest")}>
          Continue as a guest
        </button>
      </div>
    </div>
  );
};

export default SignIn;
