import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import apiUrl from "./apiUrl.js";
import "./App.css";
import { editCart } from "./functions/editCart";
import { getCart } from "./functions/getCart";

import About from "./components/about/about.jsx";
import CancelOrder from "./components/cancel-order/cancel-order.jsx";
import CategoryCarousel from "./components/carousel-container/carousel-container.jsx";
import Cart from "./components/cart/cart.jsx";
import CheckoutContainer from "./components/checkout-container/checkout-container.jsx";
import FAQ from "./components/faq/faq.jsx";
import Footer from "./components/footer/footer.jsx";
import LoadingIcon from "./components/loading-icon/loading-icon.jsx";
import Menu from "./components/menu/menu.jsx";
import Mission from "./components/mission/mission.jsx";
import SearchBar from "./components/search-bar/search-bar.jsx";
import Title from "./components/title/title.jsx";
import CartToast from "./components/toast/cart-toast.jsx";
import DarkMode from "./components/toggle-theme/toggle-theme.jsx";

function App() {
  const [inventory, setInventory] = useState({});
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
  const [showCancelOrder, setShowCancelOrder] = useState(
    localStorage.getItem("showCancelOrder") === "true" ?? false
  );
  const [showFAQ, setShowFAQ] = useState(
    localStorage.getItem("showFAQ") === "true" ?? false
  );
  const [isLoading, setIsLoading] = useState(false);

  const openCheckout = () => {
    setIsCheckoutOpen(true);
    localStorage.setItem("isCheckoutOpen", true);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
    localStorage.setItem("isCheckoutOpen", false);
  };

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${apiUrl}/inventory`)
      .then((res) => setInventory(res.data))
      .catch((err) => {
        console.error("Error fetching inventory:", err);
      })
      .finally(() => setIsLoading(false));
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
          setShowCancelOrder={setShowCancelOrder}
          setShowFAQ={setShowFAQ}
        />
        <Menu
          setShowMission={setShowMission}
          setShowAbout={setShowAbout}
          setShowCancelOrder={setShowCancelOrder}
          openCheckout={openCheckout}
          closeCheckout={closeCheckout}
          setShowFAQ={setShowFAQ}
        />
      </div>
      <div className="main">
        {showMission ? (
          <Mission />
        ) : showAbout ? (
          <About />
        ) : showCancelOrder ? (
          <CancelOrder />
        ) : showFAQ ? (
          <FAQ />
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
            {isCheckoutOpen ? (
              <CheckoutContainer
                closeCheckout={closeCheckout}
                cart={cart}
                setCart={setCart}
              />
            ) : isLoading ? (
              <div className="home-loading-icon">
                <LoadingIcon />
              </div>
            ) : (
              <CategoryCarousel
                inventory={inventory}
                cart={cart}
                editCart={cartEditor}
              />
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
            {showToast && (
              <CartToast
                message={toastMessage}
                onClose={() => setShowToast(false)}
                color={toastColor}
              />
            )}
          </>
        )}

        <DarkMode />
      </div>
      <Footer
        setShowMission={setShowMission}
        setShowAbout={setShowAbout}
        closeCheckout={closeCheckout}
      />
    </div>
  );
}

export default App;
