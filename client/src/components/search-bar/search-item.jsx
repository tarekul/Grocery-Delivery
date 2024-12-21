import './search-item.styles.css';

const SearchItem = ({item, editCart, cart}) => {
    const enableButton = cart.find(cartItem => cartItem.item.id === item.id);
    return (
        <div className="search-item">
            <img src={item.image} alt={item.name} />
            <div className="search-item-details">
                <h4 className="search-item-name">{item.name}</h4>
                <p className="search-item-price">${item.price}</p>
                <div className="search-item-quantity">
                    <button className={`search-item-quantity-button red ${!enableButton ? 'disabled' : ''}`} onClick={() => editCart(item.id, 'cart', 'remove')} disabled={!enableButton}>-</button>
                    <button className="search-item-quantity-button green" onClick={() => editCart(item.id, 'cart')}>+</button>
                </div>
            </div>
        </div>
    )
}

export default SearchItem;
