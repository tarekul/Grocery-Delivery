import React from "react";
import "./menu.styles.css";

const Menu = ({
  setShowMission,
  setShowAbout,
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

  const handleMissionClick = (isShow = true) => {
    if (isShow) {
      setShowMission(isShow);
      handleMenuClick(false);
      handleAboutClick(false);
      closeCheckout();
    } else {
      setShowMission(false);
    }
  };

  const handleAboutClick = (isShow = true) => {
    if (isShow) {
      setShowAbout(isShow);
      handleMenuClick(false);
      handleMissionClick(false);
      closeCheckout();
    } else {
      setShowAbout(false);
    }
  };

  const handleCheckoutClick = () => {
    openCheckout();
    handleMenuClick(false);
    handleAboutClick(false);
    handleMissionClick(false);
  };

  return (
    <>
      <nav>
        <ul>
          <li onClick={handleMissionClick}>Mission </li>
          <li onClick={handleAboutClick}>About</li>
          <li onClick={handleCheckoutClick}>Checkout</li>
          <li>
            <span className="tooltip-container">
              Share Recipes
              <div className="tooltip">Coming soon!</div>
            </span>
          </li>
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
