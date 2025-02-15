import SearchItem from '../search-bar/search-item';
import './search-bar.styles.css';
import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const SearchBar = ({inventory, editCart, setIsSearchBarActive, isSearchBarActive, cart, isDropdownOpen}) => {
    const [filteredInventory, setFilteredInventory] = useState([]);
    const inputRef = useRef(null);

    const handleSearchChange = (e) => {
        if (!e.target.value) {
            setFilteredInventory([]);
            setIsSearchBarActive(false);
            document.body.style.overflow = 'unset';
            return;
        }
        setIsSearchBarActive(true);
        const filteredInventory = inventory.filter(item => item.name.toLowerCase().includes(e.target.value.toLowerCase()));
        if (filteredInventory.length > 0) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        setFilteredInventory(filteredInventory);
    }

    const closeSearchBar = () => {
        setIsSearchBarActive(false);
        setFilteredInventory([]);
        document.body.style.overflow = 'unset';
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }

    return (
        <>
            {isSearchBarActive && <div className="overlay" onClick={closeSearchBar} />}
            <div className={`search-container ${isSearchBarActive ? 'active' : ''}`}>
                <div className="search">
                    <FontAwesomeIcon icon={isSearchBarActive ? faArrowLeft : faSearch} className="search-icon" onClick={closeSearchBar} />
                    <input 
                        ref={inputRef}
                        className="search-input" 
                        type="text" 
                        placeholder="" 
                        name="search" 
                        onChange={handleSearchChange}
                        autoComplete="off"
                        disabled={isDropdownOpen}
                    />
                </div>
                <div className= {`search-items ${filteredInventory.length === 0 ? 'hide' : ''}`}>
                    {filteredInventory.map(item => (
                        <SearchItem key={item.id} item={item} editCart={editCart} cart={cart} />
                    ))}
                </div>
            </div>
        </>
    );
};

export default SearchBar;
