import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { editCart } from './functions/editCart';
import { getCart } from './functions/getCart';
import apiUrl from './apiUrl.js';
import './App.css';

import Title from './components/title/title.jsx';
import Mission from './components/mission/mission.jsx';
import SearchBar from './components/search-bar/search-bar.jsx';
import Cart from './components/cart/cart.jsx';
import Toast from './components/toast/toast.jsx';
import CheckoutContainer from './components/checkout-container/checkout-container.jsx';
import DarkMode from './components/toggle-theme/toggle-theme.jsx';
import CategoryCarousel from './components/carousel-container/carousel-container.jsx';

function App() {
  const [showMission, setShowMission] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [cart, setCart] = useState(getCart());
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchBarActive, setIsSearchBarActive] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastColor, setToastColor] = useState('');

  useEffect(() => {
    axios.get(`${apiUrl}/inventory`)
      .then(res => {
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

  useEffect(() => {
    setCart(getCart());
  }, [isDropdownOpen])

  const cartEditor = useMemo(() => editCart({
    inventory,
    setCart,
    setShowToast,
    setToastMessage,
    setToastColor
  }), [inventory]);

  

  return (
    <div className="App">
      <Title setShowMission={setShowMission} showMission={showMission}/>
      {showMission && (<Mission />)}
      {!showMission && (
        <>
          {isCheckoutOpen ? (
          <CheckoutContainer 
            setIsCheckoutOpen={setIsCheckoutOpen}
            cart={cart}
          />
          ) : (
          <>
            <SearchBar 
              inventory={Object.values(inventory).flat()} 
              editCart={cartEditor} 
              setIsSearchBarActive={setIsSearchBarActive}
              isSearchBarActive={isSearchBarActive}
              cart={cart}
              isDropdownOpen={isDropdownOpen}
            />
            <CategoryCarousel inventory={inventory} cart={cart} editCart={cartEditor} />
            {showToast && (
              <Toast 
                message={toastMessage} 
                onClose={() => setShowToast(false)}
                color={toastColor}
              />
            )}
        </>
        )}
        <Cart 
              cart={cart} 
              editCart={cartEditor} 
              setIsDropdownOpen={setIsDropdownOpen} 
              isDropdownOpen={isDropdownOpen} 
              setIsCheckoutOpen={setIsCheckoutOpen} 
              isSearchBarActive={isSearchBarActive}
            />
      </>
      )}
      <DarkMode />
    </div>
  );
}

export default App;