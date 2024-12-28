export const saveCartToLocalStorage = (updatedCart) => {
    localStorage.setItem('cart', JSON.stringify(updatedCart));
};