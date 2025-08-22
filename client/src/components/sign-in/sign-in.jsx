import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import { auth } from "../../firebase-config";
import "./sign-in.styles.css";

const SignIn = ({ setUserType, setShowAuthForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        setUserType("authenticated");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
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
