import "./card-item.styles.css";

const CardItem = ({item, editCart}) => {
    return (
        <div className="card-item">
            <img src={item.image} alt={item.name} />
            <div className="item-details">
                <h3>{item.name}</h3>
                <p>${item.price}</p>
            </div>
            <div className="item-quantity">
                <button className="quantity-button red" onClick={() => editCart(item.id, 'card', 'remove')}>-</button>
                <button className="quantity-button green" onClick={() => editCart(item.id)}>+</button>
            </div>
        </div>
    )
}

export default CardItem;
