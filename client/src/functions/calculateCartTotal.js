const calculateCartTotal = (cart) => {
  return (
    Math.round(
      cart.reduce(
        (totalPrice, cartItem) =>
          (totalPrice +=
            parseInt(cartItem.quantity) * parseFloat(cartItem.price)),
        0
      ) * 100
    ) / 100
  );
};

export default calculateCartTotal;
