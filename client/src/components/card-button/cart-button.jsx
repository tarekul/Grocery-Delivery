import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBasketShopping } from '@fortawesome/free-solid-svg-icons';

import './cart-button.styles.css'

const CartButton = ({cart, toggleDropdown}) => {
    return (
        <button className="cart-button" onClick={toggleDropdown}>
            <FontAwesomeIcon icon={faBasketShopping} />
            {cart.length > 0 && <span className="cart-badge">{cart.length}</span>}
        </button>
    )
}

export default CartButton;