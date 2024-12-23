import React from 'react';
import './card-items-carousel.styles.css';

import CardItem from '../card-item/card-item';

const CardItemsCarousel = ({ inventory, editCart, cart, category }) => {
    const isGridLayout = inventory.length < 4;
    return (
        <div className={`card-items-carousel`}>
            <h5 className="category-title">{category}</h5>
            <div className={`items-list ${isGridLayout ? 'grid' : 'carousel'}`}>
                {inventory.map(item => (
                    <CardItem 
                    key={item.id} 
                    item={item} 
                    editCart={editCart} 
                    cart={cart} 
                    />
                ))}
            </div>
        </div>
    )
}

export default CardItemsCarousel;