import React, { useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import "./App.css";
import About from "./components/about/about";
import Cart from "./components/cart/cart";
import CheckoutContainer from "./components/checkout-container/checkout-container";
import FAQ from "./components/faq/faq";
import Footer from "./components/footer/footer";
import HomeView from "./components/home-view/home-view.jsx";
import Mission from "./components/mission/mission";
import Profile from "./components/profile/profile.jsx";

import Header from "./components/header/header.jsx";
import Orders from "./components/orders/orders.jsx";
import SearchBar from "./components/search-bar/search-bar.jsx";
import { useAuth } from "./contexts/authContext";
import { useUI } from "./contexts/UIContext";
import { getInventory } from "./functions/getInventory.js";

function App() {
  const { firebaseUser, userType } = useAuth();
  const { setInventory, setIsLoading } = useUI();

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
        .catch((err) => console.error(err))
        .finally(() => setIsLoading(false));
    }
  }, []);

  const UserLayout = ({ children }) => (
    <div className="App">
      <Header />
      <div className="main">
        {(firebaseUser || userType === "guest") && (
          <>
            <SearchBar />
            <Cart />
          </>
        )}
        {children}
      </div>
      <Footer />
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <UserLayout>
              <HomeView />
            </UserLayout>
          }
        />
        <Route
          path="/about"
          element={
            <UserLayout>
              <About />
            </UserLayout>
          }
        />
        <Route
          path="/mission"
          element={
            <UserLayout>
              <Mission />
            </UserLayout>
          }
        />
        <Route
          path="/faq"
          element={
            <UserLayout>
              <FAQ />
            </UserLayout>
          }
        />
        <Route
          path="/orders"
          element={
            <UserLayout>
              <Orders />
            </UserLayout>
          }
        />
        <Route
          path="/checkout"
          element={
            <UserLayout>
              <CheckoutContainer />
            </UserLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <UserLayout>
              <Profile />
            </UserLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
