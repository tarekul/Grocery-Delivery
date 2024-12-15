import './cart-item.styles.css';

const CartItem = ({cartItem, addToCart, removeFromCart}) => {
    const {item, quantity} = cartItem
    return (
        <div className="cart-item">
            <img src={item.image} alt={item.name} />
            <div className="item-details">
                <h4>{item.name}</h4>
                <p>${item.price}</p>
            </div>
            <div className="item-quantity">
                <button className="quantity-button red" onClick={() => removeFromCart(item.id, 'cart')}>-</button>
                <span>{quantity}</span>
                <button className="quantity-button green" onClick={() => addToCart(item.id, 'cart')}>+</button>
            </div>
        </div>
    )
}

export default CartItem;
