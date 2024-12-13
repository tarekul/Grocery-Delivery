import './card-items.styles.css'
import CardItem from '../card-item/card-item.jsx';

const cardItems = ({ inventory, addToCart, removeFromCart }) => {
    return (
        <div className="card-items">
            {inventory.map(item => (
                <CardItem key={item.id} item={item} addToCart={addToCart} removeFromCart={removeFromCart} />
            ))}
        </div>
    )
}

export default cardItems