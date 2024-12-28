export const getCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart'));
    return cart ?? [];
};