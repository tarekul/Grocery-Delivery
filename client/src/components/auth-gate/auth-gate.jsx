import Register from "../register/register";
import SignIn from "../sign-in/sign-in";

const AuthGate = ({
  userType,
  showAuthForm,
  setUserType,
  setShowAuthForm,
  setIsRegistering,
}) => {
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
