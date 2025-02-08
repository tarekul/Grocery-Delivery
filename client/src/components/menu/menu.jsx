import React from "react";
import "./menu.styles.css";

const Menu = ({
  setShowMission,
  setShowAbout,
  setShowCancelOrder,
  openCheckout,
  closeCheckout,
}) => {
  const handleMenuClick = (shouldShowMobileMenu) => {
    const nav = document.querySelector("nav");
    if (shouldShowMobileMenu) {
      nav.classList.add("show");
    } else {
      nav.classList.remove("show");
    }
  };

  const handleMissionClick = () => {
    setShowMission(true);
    handleMenuClick(false);
    setShowAbout(false);
    closeCheckout();
  };

  const handleAboutClick = () => {
    setShowAbout(true);
    handleMenuClick(false);
    setShowMission(false);
    closeCheckout();
  };

  const handleCheckoutClick = () => {
    openCheckout();
    handleMenuClick(false);
    setShowAbout(false);
    setShowMission(false);
  };

  const handleCancelOrderClick = () => {
    setShowCancelOrder(true);
    setShowAbout(false);
    setShowMission(false);
    handleMenuClick(false);
  };

  return (
    <>
      <nav>
        <ul>
          <li onClick={handleMissionClick}>Mission </li>
          <li onClick={handleAboutClick}>About</li>
          <li onClick={handleCheckoutClick}>Checkout</li>
          <li onClick={handleCancelOrderClick}>Cancel Order</li>
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
