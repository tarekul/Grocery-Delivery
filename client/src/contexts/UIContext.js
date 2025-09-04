import { createContext, useContext, useEffect, useState } from "react";
import { getInventory } from "../functions/getInventory";

const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [category, setCategory] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [showAuthForm, setShowAuthForm] = useState("signin");

  const [inventory, setInventory] = useState({});

  const [isShoppersAvailable, setIsShoppersAvailable] = useState(false);

  const [isCartOpen, setIsCartOpen] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [isClosingSearch, setIsClosingSearch] = useState(false);

  const toggleSearch = () => {
    if (isSearchOpen) {
      setIsClosingSearch(true);
      if (window.innerWidth <= 768) {
        document.body.style.overflow = "unset";
      }

      setTimeout(() => {
        setIsClosingSearch(false);
        setIsSearchOpen(false);
      }, 500);
    } else {
      setIsSearchOpen(true);
      if (window.innerWidth <= 768) {
        document.body.style.overflow = "hidden";
      }
    }
  };

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
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        isClosingSearch,
        setIsClosingSearch,
        toggleSearch,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
