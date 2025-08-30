import { createContext, useContext, useEffect, useState } from "react";
import { getInventory } from "../functions/getInventory";

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [activeView, setActiveView] = useState(
    localStorage.getItem("activeView") || "home"
  );

  useEffect(() => {
    localStorage.setItem("activeView", activeView);
  }, [activeView]);

  const [category, setCategory] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [showAuthForm, setShowAuthForm] = useState("signin");

  const [inventory, setInventory] = useState({});

  const [isShoppersAvailable, setIsShoppersAvailable] = useState(false);

  const [isSearchBarActive, setIsSearchBarActive] = useState(false);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("inventory")) {
      setInventory(JSON.parse(localStorage.getItem("inventory")));
    } else {
      setIsLoading(true);
      getInventory()
        .then((res) => {
          setInventory(res);
          localStorage.setItem("inventory", JSON.stringify(res));
        })
        .catch((err) => console.error("Error fetching inventory:", err))
        .finally(() => setIsLoading(false));
    }
  }, []);

  return (
    <UIContext.Provider
      value={{
        activeView,
        setActiveView,
        category,
        setCategory,
        isLoading,
        setIsLoading,
        showAuthForm,
        setShowAuthForm,
        inventory,
        setInventory,
        isShoppersAvailable,
        setIsShoppersAvailable,
        isSearchBarActive,
        setIsSearchBarActive,
        isDropdownOpen,
        setIsDropdownOpen,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
