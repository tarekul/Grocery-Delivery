import "./card-item.styles.css";

const CardItem = ({item, editCart, cart}) => {
    const enableButton = cart.find(cartItem => cartItem.item.id === item.id);
    return (
        <div className="card-item">
            <img src={process.env.REACT_APP_API_URL + item.image} alt={item.name} />
                <h3 className="item-name">{item.name}</h3>
                <p className="item-price">${item.price}</p>
            <div className="item-quantity">
                <button className={`quantity-button red ${!enableButton ? 'disabled' : ''}`} onClick={() => editCart(item.id, 'card', 'remove')} disabled={!enableButton}>-</button>
                <button className="quantity-button green" onClick={() => editCart(item.id)}>+</button>
            </div>
        </div>
    )
}

export default CardItem;
