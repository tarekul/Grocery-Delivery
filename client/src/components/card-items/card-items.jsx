import './card-items.styles.css'
import CardItem from '../card-item/card-item.jsx';

const cardItems = ({ inventory, addToCart, removeFromCart, isDropdownOpen }) => {
    return (
        <div className={`card-items ${isDropdownOpen ? 'hide' : ''}`}>
            {inventory.map(item => (
                <CardItem key={item.id} item={item} addToCart={addToCart} removeFromCart={removeFromCart} />
            ))}
        </div>
    )
}

export default cardItems