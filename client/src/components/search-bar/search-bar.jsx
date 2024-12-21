import SearchItem from '../search-bar/search-item';
import './search-bar.styles.css';
import { useState } from 'react';

const SearchBar = ({inventory, editCart, setIsSearchBarOpen }) => {
    const [filteredInventory, setFilteredInventory] = useState([]);

    const handleSearchChange = (e) => {
        if (!e.target.value) {
            setFilteredInventory([]);
            setIsSearchBarOpen(false);
            return;
        }
        const filteredInventory = inventory.filter(item => item.name.toLowerCase().includes(e.target.value.toLowerCase()));
        if (filteredInventory.length > 0) {
            setIsSearchBarOpen(true);
            document.body.style.overflow = 'hidden';
        } else {
            setIsSearchBarOpen(false);
            document.body.style.overflow = 'unset';
        }
        setFilteredInventory(filteredInventory);
    }



    return (
        <div className="search-container">
            <div className="search">
                <input 
                    className="search-input" 
                    type="text" 
                    placeholder="Search" 
                    name="search" 
                    onChange={handleSearchChange}
                    autoComplete="off"
                />
            </div>
            <div className= {`search-items ${filteredInventory.length === 0 ? 'hide' : ''}`}>
                {filteredInventory.map(item => (
                    <SearchItem key={item.id} item={item} editCart={editCart} />
                ))}
            </div>
        </div>
    );
};

export default SearchBar;