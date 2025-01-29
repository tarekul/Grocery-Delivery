import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import apiUrl from "./apiUrl.js";
import "./App.css";
import { editCart } from "./functions/editCart";
import { getCart } from "./functions/getCart";

import About from "./components/about/about.jsx";
import CategoryCarousel from "./components/carousel-container/carousel-container.jsx";
import Cart from "./components/cart/cart.jsx";
import CheckoutContainer from "./components/checkout-container/checkout-container.jsx";
import Menu from "./components/menu/menu.jsx";
import Mission from "./components/mission/mission.jsx";
import SearchBar from "./components/search-bar/search-bar.jsx";
import Title from "./components/title/title.jsx";
import Toast from "./components/toast/toast.jsx";
import DarkMode from "./components/toggle-theme/toggle-theme.jsx";

function App() {
  const [inventory, setInventory] = useState([]);
  const [cart, setCart] = useState(getCart());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchBarActive, setIsSearchBarActive] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(
    localStorage.getItem("isCheckoutOpen") === "true" ?? false
  );
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState("");
  const [showMission, setShowMission] = useState(
    localStorage.getItem("showMission") === "true" ?? false
  );
  const [showAbout, setShowAbout] = useState(
    localStorage.getItem("showAbout") === "true" ?? false
  );

  const openCheckout = () => {
    setIsCheckoutOpen(true);
    localStorage.setItem("isCheckoutOpen", true);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
    localStorage.setItem("isCheckoutOpen", false);
  };

  useEffect(() => {
    axios
      .get(`${apiUrl}/inventory`)
      .then((res) => {
        const inventoryData = res.data;
        localStorage.setItem("inventory", JSON.stringify(inventoryData));
        setInventory(inventoryData);
      })
      .catch((err) => {
        console.error("Error fetching inventory:", err);
        if (localStorage.getItem("inventory")) {
          setInventory(JSON.parse(localStorage.getItem("inventory")));
        }
      });
  }, []);

  useEffect(() => {
    setCart(getCart());
  }, [isDropdownOpen]);

  const cartEditor = useMemo(
    () =>
      editCart({
        inventory,
        setCart,
        setShowToast,
        setToastMessage,
        setToastColor,
      }),
    [inventory]
  );

  return (
    <div className="App">
      <div className="header">
        <Title
          closeCheckout={closeCheckout}
          setMission={setShowMission}
          setShowAbout={setShowAbout}
        />
        <Menu
          setShowMission={setShowMission}
          setShowAbout={setShowAbout}
          openCheckout={openCheckout}
          closeCheckout={closeCheckout}
        />
      </div>
      {showMission ? (
        <Mission />
      ) : showAbout ? (
        <About />
      ) : (
        <>
          {isCheckoutOpen ? (
            <>
              <SearchBar
                inventory={Object.values(inventory).flat()}
                editCart={cartEditor}
                setIsSearchBarActive={setIsSearchBarActive}
                isSearchBarActive={isSearchBarActive}
                cart={cart}
                isDropdownOpen={isDropdownOpen}
              />
              <CheckoutContainer
                closeCheckout={closeCheckout}
                cart={cart}
                setCart={setCart}
              />
            </>
          ) : (
            <>
              <SearchBar
                inventory={Object.values(inventory).flat()}
                editCart={cartEditor}
                setIsSearchBarActive={setIsSearchBarActive}
                isSearchBarActive={isSearchBarActive}
                cart={cart}
                isDropdownOpen={isDropdownOpen}
              />
              <CategoryCarousel
                inventory={inventory}
                cart={cart}
                editCart={cartEditor}
              />
              {showToast && (
                <Toast
                  message={toastMessage}
                  onClose={() => setShowToast(false)}
                  color={toastColor}
                />
              )}
            </>
          )}
          <Cart
            cart={cart}
            editCart={cartEditor}
            setCart={setCart}
            setIsDropdownOpen={setIsDropdownOpen}
            isDropdownOpen={isDropdownOpen}
            openCheckout={openCheckout}
            isSearchBarActive={isSearchBarActive}
          />
        </>
      )}

      <DarkMode />
    </div>
  );
}

export default App;
