import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth } from "../../firebase-config";
import areShoppersAvailable from "../../functions/areShoppersAvailable";
import "./menu.styles.css";

const Menu = ({
  setShowMission,
  setShowAbout,
  setShowCancelOrder,
  openCheckout,
  closeCheckout,
  setShowFAQ,
  isShoppersAvailable,
  setIsShoppersAvailable,
}) => {
  const [userType, setUserType] = useState(null);

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
    setShowAbout(false);
    setShowMission(false);
    setShowCancelOrder(false);
    setShowFAQ(false);
  };

  const handleCancelOrderClick = () => {
    setShowCancelOrder(true);
    setShowAbout(false);
    setShowMission(false);
    closeCheckout();
    setShowFAQ(false);
    handleMenuClick(false);
  };

  const handleFaqClick = () => {
    setShowFAQ(true);
    setShowAbout(false);
    setShowCancelOrder(false);
    setShowMission(false);
    closeCheckout();
    handleMenuClick(false);
  };

  useEffect(() => {
    areShoppersAvailable((available) => {
      setIsShoppersAvailable(available);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserType("user");
      } else {
        setUserType(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogoutClick = () => {
    auth.signOut();
    setUserType(null);
    handleMenuClick(false);
  };

  return (
    <>
      <nav>
        <ul>
          {userType === "user" && (
            <li>
              <span className="tooltip-container">
                <i className="fa-solid fa-user fa-xs"></i>
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
          {userType === "user" && (
            <li className="menu-item" onClick={handleLogoutClick}>
              Logout
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
