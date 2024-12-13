import './card-items.styles.css'
import CartItem from '../card-item/card-item.jsx';

const cardItems = ({ inventory, addToCart, removeFromCart }) => {
    return (
        <div className="card-items">
            {inventory.map(item => (
                <CartItem key={item.id} item={item} addToCart={addToCart} removeFromCart={removeFromCart} />
            ))}
        </div>
    )
}

export default cardItems