import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { editCart } from "../functions/editCart";
import { getCart } from "../functions/getCart";
import { useUI } from "./UIContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(getCart());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState("");

  const { inventory } = useUI();

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

  useEffect(() => {
    setCart(getCart());
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        cartEditor,
        showToast,
        setShowToast,
        toastMessage,
        toastColor,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
