import { useAuth } from "../../contexts/authContext";
import { useUI } from "../../contexts/UIContext";
import BrandWelcome from "../brand-welcome/brand-welcome";
import Register from "../register/register";
import SignIn from "../sign-in/sign-in";
import "./auth-gate.styles.css";

const AuthGate = () => {
  const { userType, setUserType, setIsRegistering } = useAuth();

  const { showAuthForm, setShowAuthForm } = useUI();
  if (userType !== null) return null;

  if (showAuthForm === "signin") {
    return (
      <div className="auth-gate">
        <SignIn setUserType={setUserType} setShowAuthForm={setShowAuthForm} />
        <BrandWelcome />
      </div>
    );
  }

  if (showAuthForm === "register") {
    return (
      <div className="auth-gate">
        <Register
          setShowAuthForm={setShowAuthForm}
          setIsRegistering={setIsRegistering}
        />
        <BrandWelcome />
      </div>
    );
  }

  return null;
};

export default AuthGate;
