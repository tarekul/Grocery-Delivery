import React from "react";
import "./menu.styles.css";

const Menu = ({ setShowMission }) => {
  const handleMenuClick = () => {
    const nav = document.querySelector("nav");
    nav.classList.toggle("show");
  };

  const handleMissionClick = () => {
    localStorage.setItem("showMission", true);
    setShowMission(true);
  };

  return (
    <>
      <nav>
        <ul>
          <li onClick={handleMissionClick}>Mission </li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </nav>
      <i className="fa-solid fa-bars fa-lg" onClick={handleMenuClick}></i>
    </>
  );
};

export default Menu;
