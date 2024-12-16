import './cart-item.styles.css';

const CartItem = ({cartItem, editCart, removeFromCart}) => {
    const {item, quantity} = cartItem
    return (
        <div className="cart-item">
            <img src={item.image} alt={item.name} />
            <div className="item-details">
                <h4>{item.name}</h4>
                <p>${item.price}</p>
            </div>
            <div className="item-quantity">
                <button className="quantity-button red" onClick={() => editCart(item.id, 'cart', 'remove')}>-</button>
                <span>{quantity}</span>
                <button className="quantity-button green" onClick={() => editCart(item.id, 'cart')}>+</button>
            </div>
        </div>
    )
}

export default CartItem;
