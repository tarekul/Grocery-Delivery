import './card-items-carousel.styles.css';

import CardItem from '../card-item/card-item';

const CardItemsCarousel = ({ inventory, editCart, isDropdownOpen, category }) => {
    return (
        <div className={`card-items-carousel ${isDropdownOpen ? 'hide' : ''}`}>
            <h5 className="category-title">{category}</h5>
            <div className="carousel-items">
                {inventory.map(item => (
                    <CardItem key={item.id} item={item} editCart={editCart} />
                ))}
            </div>
        </div>
    )
}

export default CardItemsCarousel;