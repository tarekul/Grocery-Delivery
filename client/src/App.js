import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { editCart } from './functions/editCart';
import { handleFormChange } from './functions/handleFormChange';
import { handleOrderSubmit } from './functions/handleOrderSubmit';
import './App.css';

import Title from './components/title/title.jsx';
import CategorySelector from './components/category-selector/category-selector.jsx';
import CardItems from './components/card-items/card-items.jsx';
import Cart from './components/cart/cart.jsx';
import Toast from './components/toast/toast.jsx';
import CheckoutContainer from './components/checkout-container/checkout-container.jsx';
import DarkMode from './components/toggle-theme/toggle-theme.jsx';
import CategoryCarousel from './components/category-carousel/category-carousel.jsx';

const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';

function App() {
  const [inventory, setInventory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cart, setCart] = useState(localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('');

  useEffect(() => {
    axios.get(`${apiUrl}/inventory`)
      .then(res => {
        console.log(res.data);
        const inventoryData = res.data
        localStorage.setItem('inventory', JSON.stringify(inventoryData));
        setInventory(inventoryData);
      })
      .catch(err => {
        console.error('Error fetching inventory:', err);
        if (localStorage.getItem('inventory')) {
          setInventory(JSON.parse(localStorage.getItem('inventory')));
        } 
      });
  }, []);

  const getInventoryByCategory = (category) => {
    if (!category || category === 'All') {
      setSelectedCategory('All');
      return;
    }
    const filtered = inventory.filter(item => item.category.toLowerCase() === category.toLowerCase());
    setSelectedCategory(category);
  };

  const formHandler = useMemo(() => handleFormChange({ 
    setForm, 
    form 
  }), [form]);

  const orderSubmitHandler = useMemo(() => handleOrderSubmit({
    cart,
    form,
    setCart,
    setForm
  }), [cart, form]);

  const cartEditor = useMemo(() => editCart({
    inventory,
    setCart,
    setShowToast,
    setToastMessage,
    setToastColor
  }), [inventory]);

  return (
    <div className="App">
      <Title />
      <DarkMode />
      {isCheckoutOpen ? (
        <CheckoutContainer 
          setIsCheckoutOpen={setIsCheckoutOpen}
          form={form}
          handleFormChange={formHandler}
          handleOrderSubmit={orderSubmitHandler}
        />
      ) : (
        <>
            <Cart 
              cart={cart} 
              editCart={cartEditor} 
              setIsDropdownOpen={setIsDropdownOpen} 
              isDropdownOpen={isDropdownOpen} 
              setIsCheckoutOpen={setIsCheckoutOpen} 
            />
          <CategorySelector getInventoryByCategory={getInventoryByCategory} />
          <CategoryCarousel inventory={inventory} editCart={cartEditor} isDropdownOpen={isDropdownOpen} />
          {/* <CardItems 
            inventory={filteredInventory} 
            editCart={cartEditor} 
            isDropdownOpen={isDropdownOpen} 
          /> */}
          {showToast && (
            <Toast 
              message={toastMessage} 
              onClose={() => setShowToast(false)}
              color={toastColor}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;