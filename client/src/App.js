import React, { useEffect } from "react";
import "./App.css";
import About from "./components/about/about";
import AuthGate from "./components/auth-gate/auth-gate.jsx";
import CancelOrder from "./components/cancel-order/cancel-order";
import Cart from "./components/cart/cart";
import Categories from "./components/categories/categories.jsx";
import CheckoutContainer from "./components/checkout-container/checkout-container";
import FAQ from "./components/faq/faq";
import Footer from "./components/footer/footer";
import LoadingIcon from "./components/loading-icon/loading-icon";
import Menu from "./components/menu/menu";
import Mission from "./components/mission/mission";
import SearchBar from "./components/search-bar/search-bar";
import ShelfCarousel from "./components/shelf-carousel/shelf-carousel.jsx";
import Title from "./components/title/title";
import CartToast from "./components/toast/cart-toast.jsx";
import Profile from "./components/profile/profile.jsx";
import { getInventory } from "./functions/getInventory.js";

import { useAuth } from "./contexts/authContext";
import { useCart } from "./contexts/cartContext";
import { useUI } from "./contexts/UIContext";

function App() {
  const { firebaseUser, userType, isRegistering } = useAuth();
  const { showToast } = useCart();
  const {
    isCheckoutOpen,
    category,
    setCategory,
    isLoading,
    setIsLoading,
    setInventory,
    activeMenu,
  } = useUI();

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

  return (
    <div className="App">
      <div className="header">
        <Title />
        {(firebaseUser || userType === "guest") && <Menu />}
      </div>
      <div className="main">
        {(firebaseUser || userType === "guest") && <Cart />}
        {activeMenu === "mission" && <Mission />}
        {activeMenu === "about" && <About />}
        {activeMenu === "cancel-order" && <CancelOrder />}
        {activeMenu === "faq" && <FAQ />}
        {activeMenu === "checkout" && <CheckoutContainer />}
        {activeMenu === "profile" && <Profile />}
        {activeMenu === null && (
          <>
            {(firebaseUser || userType === "guest") && <SearchBar />}
            {isCheckoutOpen ? (
              <CheckoutContainer />
            ) : isLoading ? (
              <div className="home-loading-icon">
                <LoadingIcon />
              </div>
            ) : (
              (firebaseUser || userType === "guest") &&
              !isRegistering && (
                <>
                  {category ? (
                    <ShelfCarousel category={category} />
                  ) : (
                    <Categories setCategory={setCategory} />
                  )}
                </>
              )
            )}
            {!firebaseUser && userType == null && <AuthGate />}

            {showToast && <CartToast />}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default App;
