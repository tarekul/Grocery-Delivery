const React = import('react');

const CheckoutContainer = ({setIsCheckoutOpen}) => {
    return (
        <div>
            Checkout
            <button onClick={() => setIsCheckoutOpen(false)}>Back</button>
        </div>
    )
}

export default CheckoutContainer;