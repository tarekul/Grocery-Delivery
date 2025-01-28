import React from "react";
import "./menu.styles.css";

const Menu = ({ showMission, showAbout, setShowMission, setShowAbout }) => {
  const handleMenuClick = () => {
    const nav = document.querySelector("nav");
    nav.classList.toggle("show");
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
      </nav>
      <i className="fa-solid fa-bars fa-lg" onClick={handleMenuClick}></i>
    </>
  );
};

export default Menu;
