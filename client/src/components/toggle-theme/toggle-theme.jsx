import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import "./toggle-theme.styles.css";

const ToggleTheme = () => {
  const [themeValue, setThemeValue] = useState("light");

  const toggleTheme = () => {
    const newTheme = themeValue === "light" ? "dark" : "light";
    setThemeValue(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  useEffect(() => {
    const hour = new Date().getHours();
    const initialTheme = hour >= 6 && hour < 18 ? "light" : "dark";
    setThemeValue(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      <FontAwesomeIcon icon={themeValue === "light" ? faMoon : faSun} />
    </button>
  );
};

export default ToggleTheme;
