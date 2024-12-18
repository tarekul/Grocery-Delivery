import './cart-item.styles.css';

const CartItem = ({cartItem, editCart, removeFromCart}) => {
    const {item, quantity} = cartItem
    return (
        <div className="cart-item">
            <img src={item.image} alt={item.name} />
            <div className="cart-item-details">
                <h4 className="cart-item-name">{item.name}</h4>
                <p className="cart-item-price">${item.price}</p>
            </div>
            <div className="cart-item-quantity">
                <button className="cart-item-quantity-button red" onClick={() => editCart(item.id, 'cart', 'remove')}>-</button>
                <span>{quantity}</span>
                <button className="cart-item-quantity-button green" onClick={() => editCart(item.id, 'cart')}>+</button>
            </div>
        </div>
    )
}

export default CartItem;
