import React, { useState } from 'react';
import "./card-item.styles.css";

const CardItem = ({item, editCart, cart}) => {
    const enableButton = cart.find(cartItem => cartItem.item.id === item.id);
    const [isFullSizeVisible, setFullSizeVisible] = useState(false);

    const handleImageClick = () => {
        setFullSizeVisible(true);
    };

    const handleOverlayClick = () => {
        setFullSizeVisible(false);
    };

    return (
        <div className="card-item" data-id={item.id}>
            <img src={item.image} alt={item.name} data-id={item.id} className="card-item-img" onClick={handleImageClick} />
            <h3 className="item-name">{item.name}</h3>
            <p className="item-price">${item.price}</p>
            <div className="item-quantity">
                <button className={`quantity-button red ${!enableButton ? 'disabled' : ''}`} onClick={() => editCart(item.id, 'card', 'remove')} disabled={!enableButton}>-</button>
                <button className="quantity-button green" onClick={() => editCart(item.id)}>+</button>
            </div>

            {isFullSizeVisible && (
                <div className="overlay" onClick={handleOverlayClick}>
                    <img src={item.image} alt={item.name} className="full-size-image" />
                </div>
            )}
        </div>
    )
}

export default CardItem;
