import { onAuthStateChanged } from "firebase/auth";
import {
  CircleUserRound,
  CreditCard,
  LogIn,
  LogOut,
  Package2,
  Search,
  UserCheck,
  UserX,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUI } from "../../contexts/UIContext";
import { useAuth } from "../../contexts/authContext";
import { auth } from "../../firebase-config";
import areShoppersAvailable from "../../functions/areShoppersAvailable";
import "./menu.styles.css";

const Menu = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const { isShoppersAvailable, setIsShoppersAvailable, toggleSearch } = useUI();
  const { setUserType } = useAuth();
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  useEffect(() => {
    areShoppersAvailable((available) => {
      setIsShoppersAvailable(available);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsUserLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogoutClick = async () => {
    try {
      await auth.signOut();
      setUserType(null);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleLoginClick = () => {
    setUserType(null);
    navigate("/");
  };

  return (
    <>
      <nav>
        <ul>
          <li>
            <span className="tooltip-container">
              {isShoppersAvailable ? (
                <UserCheck color="green" />
              ) : (
                <UserX color="red" />
              )}
              <div className="tooltip">Shopper Availability</div>
            </span>
          </li>
          {isUserLoggedIn && (
            <li>
              <CircleUserRound onClick={() => handleNavigation("/profile")} />
            </li>
          )}
          <li
            className="menu-item"
            onClick={() => handleNavigation("/checkout")}
          >
            <CreditCard />
          </li>
          <li className="menu-item" onClick={() => toggleSearch()}>
            <Search />
          </li>
          <li className="menu-item" onClick={() => handleNavigation("/orders")}>
            <Package2 />
          </li>

          {isUserLoggedIn && (
            <li className="menu-item" onClick={handleLogoutClick}>
              <LogOut />
            </li>
          )}
          {!isUserLoggedIn && (
            <li className="menu-item" onClick={handleLoginClick}>
              <LogIn />
            </li>
          )}
        </ul>
      </nav>
    </>
  );
};

export default Menu;
