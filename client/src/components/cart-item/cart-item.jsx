const CartItem = ({cartItem, addToCart, removeFromCart}) => {
    const {item, quantity} = cartItem
    return (
        <div className="cart-item">
            <img src={item.image} alt={item.name} />
            <div className="item-details">
                <h3>{item.name}</h3>
                <p>Price: ${item.price}</p>
            </div>
            <div className="item-quantity">
                <button onClick={() => removeFromCart(item.id)}>-</button>
                <span>{quantity}</span>
                <button onClick={() => addToCart(item.id)}>+</button>
            </div>
        </div>
    )
}

export default CartItem;
