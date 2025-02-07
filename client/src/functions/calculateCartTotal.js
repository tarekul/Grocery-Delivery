const calculateCartTotal = (cart) => {
  return parseFloat(
    cart
      .reduce(
        (totalPrice, cartItem) =>
          (totalPrice +=
            parseInt(cartItem.quantity) * parseFloat(cartItem.item.price)),
        0
      )
      .toFixed(2)
  );
};

export default calculateCartTotal;
