import React from "react";
import { useAuth } from "../../contexts/authContext";
import { useCart } from "../../contexts/cartContext";
import { useUI } from "../../contexts/UIContext";
import AuthGate from "../auth-gate/auth-gate";
import Categories from "../categories/categories";
import LoadingIcon from "../loading-icon/loading-icon";
import SearchBar from "../search-bar/search-bar";
import ShelfCarousel from "../shelf-carousel/shelf-carousel";
import CartToast from "../toast/cart-toast";

const HomeView = () => {
  const { firebaseUser, userType, isRegistering } = useAuth();
  const { showToast } = useCart();
  const { isLoading, category, setCategory } = useUI();
  const isUser = firebaseUser || userType === "guest";

  return (
    <>
      {isUser && <SearchBar />}

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
    </>
  );
};

export default HomeView;
