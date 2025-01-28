import React from "react";
import "./menu.styles.css";

const Menu = ({ setShowMission, setShowAbout }) => {
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
      localStorage.setItem("showMission", isShow);
      setShowMission(isShow);

      handleAboutClick(false);
    } else {
      localStorage.removeItem("showMission");
      setShowMission(false);
    }
  };

  const handleAboutClick = (isShow = true) => {
    handleMenuClick();
    if (isShow) {
      localStorage.setItem("showAbout", isShow);
      setShowAbout(isShow);

      handleMissionClick(false);
    } else {
      localStorage.removeItem("showAbout");
      setShowAbout(false);
    }
  };

  return (
    <>
      <nav>
        <ul>
          <li onClick={handleMissionClick}>Mission </li>
          <li onClick={handleAboutClick}>About</li>
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
