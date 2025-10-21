import {
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import { auth } from "../../firebase-config";
import "./sign-in.styles.css";

const SignIn = ({ setUserType, setShowAuthForm }) => {
  const [errorMsg, setErrorMsg] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
const [isSubmitting, setIsSubmitting] = useState(false);

const handleLogin = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setErrorMsg("");

  try {
    await signInWithEmailAndPassword(auth, email.trim(), password);
  } catch (err) {
    const code = err?.code || "";
    const friendly = {
      "auth/invalid-credential": "Incorrect email or password.", // new common code
      "auth/wrong-password": "Incorrect email or password.",
      "auth/user-not-found": "No user found with this email.",
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/too-many-requests":
        "Too many attempts. Try again later or reset your password.",
      "auth/network-request-failed":
        "Network error. Check your connection and try again.",
    };
    setErrorMsg(friendly[code] || "Couldn’t sign in. Please try again.");
  } finally {
    setIsSubmitting(false);
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
    <p role="alert" aria-live="polite" style={{color:"red", marginBottom:12}}>
      {errorMsg}
    </p>
  )}
        <form className="login-form" onSubmit={handleLogin}>
          <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => { 
              setEmail(e.target.value); 
              if (errorMsg) setErrorMsg("");
            }}
          />
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errorMsg) setErrorMsg("");
            }}
          />
          <button className="login-button" type="submit">
            {isSubmitting ? "Logging in…" : "Log In"}
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
