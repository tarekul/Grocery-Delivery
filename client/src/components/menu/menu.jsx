import React from "react";
import "./menu.styles.css";

const Menu = ({
  setShowMission,
  setShowAbout,
  setShowCancelOrder,
  openCheckout,
  closeCheckout,
  setShowFAQ,
}) => {
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
  };

  const handleCancelOrderClick = () => {
    setShowCancelOrder(true);
    setShowAbout(false);
    setShowMission(false);
    closeCheckout();
    handleMenuClick(false);
  };

  const handleFaqClick = () => {
    setShowFAQ(true);
    setShowAbout(false);
    setShowMission(false);
    closeCheckout();
    handleMenuClick(false);
  };

  return (
    <>
      <nav>
        <ul>
          <li onClick={handleCheckoutClick}>Checkout</li>
          <li onClick={handleCancelOrderClick}>Cancel Order</li>
          <li onClick={handleFaqClick}>FAQ</li>
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
