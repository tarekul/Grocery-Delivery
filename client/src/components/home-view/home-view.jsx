import React from "react";
import { useAuth } from "../../contexts/authContext";
import { useCart } from "../../contexts/cartContext";
import { useUI } from "../../contexts/UIContext";
import AuthGate from "../auth-gate/auth-gate";
import Categories from "../categories/categories";
import LoadingIcon from "../loading-icon/loading-icon";
import ShelfCarousel from "../shelf-carousel/shelf-carousel";
import CartToast from "../toast/cart-toast";
import "./home-view.styles.css";

const HomeView = () => {
  const { firebaseUser, userType, isRegistering } = useAuth();
  const { showToast } = useCart();
  const { isLoading, category, setCategory } = useUI();
  const isUser = firebaseUser || userType === "guest";

  return (
    <div className="home-view">
      {isLoading ? (
        <div className="home-loading-icon">
          <LoadingIcon />
        </div>
      ) : (
        isUser &&
        !isRegistering &&
        (category ? (
          <ShelfCarousel category={category} />
        ) : (
          <Categories setCategory={setCategory} />
        ))
      )}

      {!firebaseUser && userType == null && <AuthGate />}
      {showToast && <CartToast />}
    </div>
  );
};

export default HomeView;
