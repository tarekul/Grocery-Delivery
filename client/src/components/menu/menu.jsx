import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useUI } from "../../contexts/UIContext";
import { useAuth } from "../../contexts/authContext";
import { auth } from "../../firebase-config";
import areShoppersAvailable from "../../functions/areShoppersAvailable";
import "./menu.styles.css";

const Menu = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const {
    openCheckout,
    closeCheckout,
    isShoppersAvailable,
    setIsShoppersAvailable,
    setActiveMenu,
  } = useUI();

  const { setUserType } = useAuth();

  const handleMenuClick = (shouldShowMobileMenu) => {
    const nav = document.querySelector("nav");
    if (shouldShowMobileMenu) {
      nav.classList.add("show");
    } else {
      nav.classList.remove("show");
    }
  };

  const handleCheckoutClick = () => {
    openCheckout();
    handleMenuClick(false);
    setActiveMenu("checkout");
  };

  const handleCancelOrderClick = () => {
    closeCheckout();
    handleMenuClick(false);
    setActiveMenu("cancel-order");
  };

  const handleFaqClick = () => {
    closeCheckout();
    handleMenuClick(false);
    setActiveMenu("faq");
  };

  const handleProfileClick = () => {
    closeCheckout();
    handleMenuClick(false);
    setActiveMenu("profile");
  };

  useEffect(() => {
    areShoppersAvailable((available) => {
      setIsShoppersAvailable(available);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsUserLoggedIn(true);
      } else {
        setIsUserLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogoutClick = () => {
    auth.signOut();
    setUserType(null);
    handleMenuClick(false);
    closeCheckout();
    setActiveMenu(null);
  };

  const handleLoginClick = () => {
    setUserType(null);
    handleMenuClick(false);
    closeCheckout();
    setActiveMenu(null);
  };

  return (
    <>
      <nav>
        <ul>
          {isUserLoggedIn && (
            <li>
              <span className="tooltip-container">
                <i className="fa-solid fa-user fa-xs" onClick={handleProfileClick}></i>
                <div className="tooltip">View your profile. Coming soon!</div>
              </span>
            </li>
          )}
          <li>
            <span className="tooltip-container">
              Shoppers Available{" "}
              <i
                className="fa-solid fa-circle fa-xs"
                style={{ color: isShoppersAvailable ? "#63E6BE" : "#f95858" }}
              ></i>
              <div className="tooltip">
                Shows if shoppers are available to deliver your order
              </div>
            </span>
          </li>
          <li className="menu-item" onClick={handleCheckoutClick}>
            Checkout
          </li>
          <li className="menu-item" onClick={handleCancelOrderClick}>
            Cancel Order
          </li>
          <li className="menu-item" onClick={handleFaqClick}>
            FAQ
          </li>
          {isUserLoggedIn && (
            <li className="menu-item" onClick={handleLogoutClick}>
              Logout
            </li>
          )}
          {!isUserLoggedIn && (
            <li className="menu-item" onClick={handleLoginClick}>
              Login
            </li>
          )}
        </ul>
        <button className="close-button" onClick={() => handleMenuClick(false)}>
          X
        </button>
      </nav>
      <div className="menu-icon">
        <i
          className="fa-solid fa-bars fa-lg"
          onClick={() => handleMenuClick(true)}
        ></i>
      </div>
    </>
  );
};

export default Menu;
