import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import { editCart } from "./functions/editCart";
import { getCart } from "./functions/getCart";
import { getInventory } from "./functions/getInventory.js";
import { getTopSelling } from "./functions/getTopSelling.js";

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
  const [topSelling, setTopSelling] = useState([]);
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
  const [isShoppersAvailable, setIsShoppersAvailable] = useState(false);

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
    if (localStorage.getItem("inventory")) {
      setInventory(JSON.parse(localStorage.getItem("inventory")));
    } else {
      getInventory()
        .then((res) => {
          setInventory(res);
          localStorage.setItem("inventory", JSON.stringify(res));
        })
        .catch((err) => {
          console.error("Error fetching inventory:", err);
          setIsLoading(false);
        });
    }

    getTopSelling()
      .then((res) => {
        setTopSelling(res);
      })
      .catch((err) => {
        console.error("Error fetching top selling:", err);
      })
      .finally(() => {
        setIsLoading(false);
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
          setIsShoppersAvailable={setIsShoppersAvailable}
          isShoppersAvailable={isShoppersAvailable}
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
                isShoppersAvailable={isShoppersAvailable}
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
                topSelling={topSelling}
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
