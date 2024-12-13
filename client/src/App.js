import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Title from './components/title/title.jsx';
import Collection from './components/collection/collection.jsx';
import CardItems from './components/card-items/card-items.jsx';
import Cart from './components/cart/cart.jsx';

const App = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [cart, setCart] = useState(localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });

  useEffect(() => {
    axios.get('http://localhost:5001/inventory')
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

  const addToCart = (itemId) => {
    const item = inventory.find(item => item.id === itemId)
    if (item) {
      cart.findIndex(item => item.id === itemId) === -1
      ? setCart([...cart, { item, quantity: 1 }])
      : setCart([...cart.map(item => item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item)]);

      localStorage.setItem('cart', JSON.stringify(cart));
    }
    
  };

  const removeFromCart = (itemId) => {
    const item = inventory.find(item => item.id === itemId)
    if (item) {
        cart.findIndex(item => item.id === itemId) !== -1
      ? setCart([...cart.map(item => item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item)])
      : setCart([...cart.filter(item => item.id !== itemId)]);

      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }
    

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5001/order', { ...form, items: cart })
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
    <div>
      <Title />
      <Collection getInventoryByCategory={getInventoryByCategory} />
      <Cart cart={cart} addToCart={addToCart} removeFromCart={removeFromCart} />
      <CardItems inventory={filteredInventory} addToCart={addToCart} removeFromCart={removeFromCart} />
    </div>
  )
};

export default App;