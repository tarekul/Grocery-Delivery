import "./home-page.styles.css";

const HomePage = ({ setIsUserLoggedIn }) => {
  const handleLogin = (e) => {
    e.preventDefault();
    // TODO: Implement login logic
  };

  return (
    <div className="home-page">
      <div className="login-container">
        <h1>Log In</h1>
        <form className="login-form" onSubmit={handleLogin}>
          <input className="login-input" type="text" placeholder="Username" />
          <input
            className="login-input"
            type="password"
            placeholder="Password"
          />
          <button className="login-button" type="submit">
            Log In
          </button>
        </form>
        <p>
          Don't have an account? <a href="/register">Register</a>
        </p>
        <p>
          Forgot Password? <a href="/forgot-password">Forgot Password</a>
        </p>
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
