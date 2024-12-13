import "./card-item.styles.css";

const CartItem = ({item, addToCart, removeFromCart}) => {
    return (
        <div className="cart-item">
            <img src={item.image} alt={item.name} />
            <div className="item-details">
                <h3>{item.name}</h3>
                <p>Price: ${item.price}</p>
            </div>
            <div className="item-quantity">
                <button onClick={() => removeFromCart(item.id)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => addToCart(item.id)}>+</button>
            </div>
        </div>
    )
}

export default CartItem;
