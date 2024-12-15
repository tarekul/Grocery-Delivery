import "./card-item.styles.css";

const CardItem = ({item, addToCart, removeFromCart}) => {
    return (
        <div className="card-item">
            <img src={item.image} alt={item.name} />
            <div className="item-details">
                <h3>{item.name}</h3>
                <p>${item.price}</p>
            </div>
            <div className="item-quantity">
                <button className="quantity-button red" onClick={() => removeFromCart(item.id)}>-</button>
                <button className="quantity-button green" onClick={() => addToCart(item.id)}>+</button>
            </div>
        </div>
    )
}

export default CardItem;
