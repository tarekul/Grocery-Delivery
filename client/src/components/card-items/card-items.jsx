import './card-items.styles.css'
import CardItem from '../card-item/card-item.jsx';

const cardItems = ({ inventory, editCart, isDropdownOpen }) => {
    return (
        <div className={`card-items ${isDropdownOpen ? 'hide' : ''}`}>
            {inventory.map(item => (
                <CardItem key={item.id} item={item} editCart={editCart} />
            ))}
        </div>
    )
}

export default cardItems