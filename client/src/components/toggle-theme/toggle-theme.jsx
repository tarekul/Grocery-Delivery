import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import "./toggle-theme.styles.css";

const ToggleTheme = () => {
  const [themeValue, setThemeValue] = useState(
    localStorage.getItem("theme") || "light"
  );

  const toggleTheme = () => {
    const newTheme = themeValue === "light" ? "dark" : "light";
    setThemeValue(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themeValue);
  }, [themeValue]);

  return (
    <button className="theme-toggle" onClick={toggleTheme}>
      <FontAwesomeIcon icon={themeValue === "light" ? faMoon : faSun} />
    </button>
  );
};

export default ToggleTheme;
