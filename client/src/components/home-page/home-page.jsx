import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import { auth } from "../../firebase-config";
import "./home-page.styles.css";

const HomePage = ({ setUserType }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginPage, setIsLoginPage] = useState(true);

  const handleLogin = (e) => {
    e.preventDefault();
    if (isLoginPage) {
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
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          setUserType("authenticated");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });
    }
  };

  return (
    <div className="home-page">
      <div className="login-container">
        <h1>{isLoginPage ? "Log In" : "Register"}</h1>
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
            {isLoginPage ? "Log In" : "Register"}
          </button>
        </form>
        <p>
          Don't have an account?{" "}
          <button onClick={() => setIsLoginPage(!isLoginPage)}>
            {isLoginPage ? "Register" : "Log In"}
          </button>
        </p>
        {isLoginPage && (
          <p>
            Forgot Password? <a href="/forgot-password">Forgot Password</a>
          </p>
        )}
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

export default HomePage;
