import { useAuth } from "../../contexts/authContext";
import { useUI } from "../../contexts/UIContext";
import Register from "../register/register";
import SignIn from "../sign-in/sign-in";

const AuthGate = () => {
  const { userType, setUserType, setIsRegistering } = useAuth();

  const { showAuthForm, setShowAuthForm } = useUI();
  if (userType !== null) return null;

  if (showAuthForm === "signin") {
    return (
      <SignIn setUserType={setUserType} setShowAuthForm={setShowAuthForm} />
    );
  }

  if (showAuthForm === "register") {
    return (
      <Register
        setShowAuthForm={setShowAuthForm}
        setIsRegistering={setIsRegistering}
      />
    );
  }

  return null;
};

export default AuthGate;
