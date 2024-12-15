import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

import Title from './components/title/title.jsx';
import DropdownContainer from './components/dropdown-container/dropdown-container.jsx';
import Collection from './components/collection/collection.jsx';
import CardItems from './components/card-items/card-items.jsx';
import Cart from './components/cart/cart.jsx';
import Toast from './components/toast/toast.jsx';

const apiUrl =  process.env.REACT_APP_API_URL || 'http://localhost:5001';

const App = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [cart, setCart] = useState(localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('');

  useEffect(() => {
    axios.get(`${apiUrl}/inventory`)
    .then(res => {
      setInventory(res.data.data);
      setFilteredInventory(res.data.data);
    })
    .catch(err => {
      console.log(err);
    });
  }, []);

  const getInventoryByCategory = (category) => {
    if (category === 'all') {
      setFilteredInventory(inventory);
      return;
    }
    const filtered = inventory.filter(item => 
      item.category.toLowerCase() === category.toLowerCase()
    );
    setFilteredInventory(filtered);
  }

  const addToCart = (itemId, source='card') => {
    const item = inventory.find(item => item.id === itemId);
  
    if (item) {
      setCart(prevCart => {
        if (!Array.isArray(prevCart)) {
          console.error('Cart state is not valid.');
          return prevCart;
        }
  
        const itemExists = prevCart.find(cartItem => cartItem.item.id === item.id);

        if (itemExists && itemExists.quantity >= 20) {
          return prevCart;
        }

        const updatedCart = itemExists
          ? prevCart.map(cartItem =>
              cartItem.item.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            )
          : [...prevCart, { item, quantity: 1 }];
  
        // Save the updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        
        if(source === 'card') {
          setShowToast(false);
          setToastColor('');
          setTimeout(() => {
            setToastMessage(`${item.name} added to cart!`);
            setShowToast(true);
            setToastColor('green');
          }, 100);
        }
        
  
        return updatedCart;
      });
    } else {
      console.error('Item not found in inventory.');
    }
  };
  
  const removeFromCart = (itemId, source='card') => {
    const item = inventory.find(item => item.id === itemId);
  
    if (item) {
      setCart(prevCart => {
        if (!Array.isArray(prevCart)) {
          console.error('Cart state is not valid.');
          return prevCart;
        }
  
        const itemExists = prevCart.some(cartItem => cartItem.item.id === item.id);
  
        if (!itemExists) {
          console.error('Item not found in the cart.');
          return prevCart;
        }
  
        const updatedCart = prevCart
          .map(cartItem =>
            cartItem.item.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity - 1 }
              : cartItem
          )
          .filter(cartItem => cartItem.quantity > 0); // Remove items with quantity 0
  
        // Save the updated cart to localStorage
        localStorage.setItem('cart', JSON.stringify(updatedCart));

        if(source === 'card') {
          setShowToast(false);
          setToastColor('');
          setTimeout(() => {
            setToastMessage(`${item.name} removed from cart!`);
            setShowToast(true);
            setToastColor('red');
          }, 100);
        }
  
        return updatedCart;
      });
    } else {
      console.error('Item not found in inventory.');
    }
  };  

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    axios.post(`${apiUrl}/order`, { ...form, items: cart })
    .then(res => {
      console.log(res.data);
      setCart([]);
      setForm({ name: '', phone: '', address: '' });
    })
    .catch(err => {
      console.log(err);
    });
  };

  return (
    <div className="App">
      <Title />
      <DropdownContainer>
        <Collection getInventoryByCategory={getInventoryByCategory} />
        <Cart cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />
      </DropdownContainer>
      <CardItems inventory={filteredInventory} addToCart={addToCart} removeFromCart={removeFromCart} />
      {showToast && (
        <Toast 
          message={toastMessage} 
          onClose={() => setShowToast(false)}
          color={toastColor}
        />
      )}
    </div>
  )
};

export default App;