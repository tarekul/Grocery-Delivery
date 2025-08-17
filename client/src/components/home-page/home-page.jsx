import { useState } from "react";
import "./home-page.styles.css";

const HomePage = ({ setIsUserLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginPage, setIsLoginPage] = useState(true);

  const handleLogin = (e) => {
    e.preventDefault();
  };

  return (
    <div className="home-page">
      <div className="login-container">
        <h1>{isLoginPage ? "Log In" : "Register"}</h1>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            className="login-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        <button onClick={() => setIsUserLoggedIn(true)}>
          Continue as a guest
        </button>
      </div>
    </div>
  );
};

export default HomePage;
