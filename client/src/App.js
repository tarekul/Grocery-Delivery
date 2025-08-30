import React, { useEffect } from "react";
import "./App.css";
import About from "./components/about/about";
import CancelOrder from "./components/cancel-order/cancel-order";
import Cart from "./components/cart/cart";
import CheckoutContainer from "./components/checkout-container/checkout-container";
import FAQ from "./components/faq/faq";
import Footer from "./components/footer/footer";
import Menu from "./components/menu/menu";
import Mission from "./components/mission/mission";
import Profile from "./components/profile/profile.jsx";
import Title from "./components/title/title";
import { getInventory } from "./functions/getInventory.js";

import HomeView from "./components/home-view/home-view.jsx";
import { useAuth } from "./contexts/authContext";
import { useUI } from "./contexts/UIContext";

function App() {
  const { firebaseUser, userType } = useAuth();
  const { setIsLoading, setInventory, activeView } = useUI();

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

  const viewMap = {
    mission: <Mission />,
    about: <About />,
    cancelOrder: <CancelOrder />,
    faq: <FAQ />,
    checkout: <CheckoutContainer />,
    profile: <Profile />,
    home: <HomeView />,
  };

  return (
    <div className="App">
      <div className="header">
        <Title />
        {(firebaseUser || userType === "guest") && <Menu />}
      </div>
      <div className="main">
        {(firebaseUser || userType === "guest") && <Cart />}
        {viewMap[activeView]}
      </div>
      <Footer />
    </div>
  );
}

export default App;
