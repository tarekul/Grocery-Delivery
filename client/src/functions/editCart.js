export const editCart = (dependencies) => {
    const { inventory, setCart, setShowToast, setToastMessage, setToastColor } = dependencies;
    
    return (itemId, source='card', operation='add') => {
        const item = Object.values(inventory).flat().find(item => item.id === itemId);
    
        if (item) {
            setCart(prevCart => {
                if (!Array.isArray(prevCart)) {
                    console.error('Cart state is not valid.');
                    return prevCart;
                }
    
                const itemExists = prevCart.find(cartItem => cartItem.item.id === item.id);

                if (itemExists && itemExists.quantity >= 20 && operation === 'add') {
                    return prevCart;
                }

                // Update the quantity of the item
                let updatedCart = itemExists
                    ? prevCart.map(cartItem =>
                        cartItem.item.id === item.id
                            ? { ...cartItem, quantity: cartItem.quantity + (operation === 'add' ? 1 : -1) }
                            : cartItem
                    )
                    : operation === 'add' ? [...prevCart, { item, quantity: 1 }] : prevCart;

                // Remove cart items with quantity 0
                updatedCart = updatedCart.filter(cartItem => cartItem.quantity > 0);
    
                // Save the updated cart to localStorage
                localStorage.setItem('cart', JSON.stringify(updatedCart));
            
                if(source === 'card') {
                    setShowToast(false);
                    setToastColor('');
                    setTimeout(() => {
                        setToastMessage(`${item.name} ${operation === 'add' ? 'added to cart!' : 'removed from cart!'}`);
                        setShowToast(true);
                        setToastColor(operation === 'add' ? 'green' : 'red');
                    }, 100);
                }
            
                return updatedCart;
            });
        } else {
            console.error('Item not found in inventory.');
        }
    };
};