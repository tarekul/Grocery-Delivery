import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useMemo, useState } from "react";
import "./App.css";
import About from "./components/about/about";
import CancelOrder from "./components/cancel-order/cancel-order";
import Cart from "./components/cart/cart";
import CheckoutContainer from "./components/checkout-container/checkout-container";
import FAQ from "./components/faq/faq";
import Footer from "./components/footer/footer";
import LoadingIcon from "./components/loading-icon/loading-icon";
import Menu from "./components/menu/menu";
import Mission from "./components/mission/mission";
import SearchBar from "./components/search-bar/search-bar";
import Title from "./components/title/title";
import CartToast from "./components/toast/cart-toast.jsx";
import { auth } from "./firebase-config";

import AuthGate from "./components/auth-gate/auth-gate.jsx";
import Categories from "./components/categories/categories.jsx";
import ShelfCarousel from "./components/shelf-carousel/shelf-carousel.jsx";
import { editCart } from "./functions/editCart";
import { getCart } from "./functions/getCart";
import { getInventory } from "./functions/getInventory.js";

function App() {
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [userType, setUserType] = useState(null);
  const [showAuthForm, setShowAuthForm] = useState("signin");
  const [inventory, setInventory] = useState({});
  const [isRegistering, setIsRegistering] = useState(false);
  const [category, setCategory] = useState(null);
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
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!isRegistering) {
        setFirebaseUser(user);
        setUserType(user ? "authenticated" : null);
      }
    });
    return () => unsubscribe();
  }, [isRegistering]);

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
        .catch((err) => {
          console.error("Error fetching inventory:", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
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
          setCategory={setCategory}
        />
        {(firebaseUser || userType === "guest") && (
          <Menu
            setShowMission={setShowMission}
            setShowAbout={setShowAbout}
            setShowCancelOrder={setShowCancelOrder}
            openCheckout={openCheckout}
            closeCheckout={closeCheckout}
            setShowFAQ={setShowFAQ}
            setIsShoppersAvailable={setIsShoppersAvailable}
            isShoppersAvailable={isShoppersAvailable}
            setUserType={setUserType}
          />
        )}
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
            {(firebaseUser || userType === "guest") && (
              <SearchBar
                inventory={inventory}
                editCart={cartEditor}
                setIsSearchBarActive={setIsSearchBarActive}
                isSearchBarActive={isSearchBarActive}
                cart={cart}
                isDropdownOpen={isDropdownOpen}
              />
            )}
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
              (firebaseUser || userType === "guest") &&
              !isRegistering && (
                <>
                  {category ? (
                    <ShelfCarousel
                      editCart={cartEditor}
                      cart={cart}
                      inventory={inventory[category]}
                    />
                  ) : (
                    <Categories setCategory={setCategory} />
                  )}
                </>
              )
            )}
            {!firebaseUser && userType == null && (
              <AuthGate
                userType={userType}
                showAuthForm={showAuthForm}
                setUserType={setUserType}
                setShowAuthForm={setShowAuthForm}
                setIsRegistering={setIsRegistering}
              />
            )}

            {(firebaseUser || userType === "guest") && (
              <Cart
                cart={cart}
                editCart={cartEditor}
                setCart={setCart}
                setIsDropdownOpen={setIsDropdownOpen}
                isDropdownOpen={isDropdownOpen}
                openCheckout={openCheckout}
                isSearchBarActive={isSearchBarActive}
              />
            )}
            {showToast && (
              <CartToast
                message={toastMessage}
                onClose={() => setShowToast(false)}
                color={toastColor}
              />
            )}
          </>
        )}
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
