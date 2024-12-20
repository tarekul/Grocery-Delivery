import React from 'react';
import CardItemsCarousel from '../card-item-carousel/card-items-carousel';
import './carousel-container.styles.css';

const CarouselContainer = ({inventory, editCart, isDropdownOpen}) => {
    return (
        <div className="carousel-container">
            {
                Object.entries(inventory).map(([category, items]) => (
                    <CardItemsCarousel 
                        key={category} 
                        inventory={items} 
                        category={category} 
                        editCart={editCart} 
                        isDropdownOpen={isDropdownOpen}
                    />
                ))
            }
        </div>
    )
}

export default CarouselContainer;