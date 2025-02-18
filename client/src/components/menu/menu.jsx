import React, { useEffect, useState } from "react";
import areShoppersAvailable from "../../functions/areShoppersAvailable";
import "./menu.styles.css";

const Menu = ({
  setShowMission,
  setShowAbout,
  setShowCancelOrder,
  openCheckout,
  closeCheckout,
  setShowFAQ,
}) => {
  const [isShoppersAvailable, setIsShoppersAvailable] = useState(false);

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

  return (
    <>
      <nav>
        <ul>
          <li>
            Shoppers Available{" "}
            <i
              className="fa-solid fa-circle fa-xs"
              style={{ color: isShoppersAvailable ? "#63E6BE" : "#f95858" }}
            ></i>
          </li>
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
