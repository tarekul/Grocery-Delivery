import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase-config";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [userType, setUserType] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!isRegistering) {
        setFirebaseUser(user);
        setUserType(user ? "authenticated" : null);
        setAuthLoading(false);
      }
    });
    return () => unsubscribe();
  }, [isRegistering]);

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        userType,
        setUserType,
        isRegistering,
        setIsRegistering,
        authLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
