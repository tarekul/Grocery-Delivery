import { faCircleXmark, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef, useState } from "react";
import SearchItem from "../search-bar/search-item";
import "./search-bar.styles.css";

const SearchBar = ({
  inventory,
  editCart,
  setIsSearchBarActive,
  isSearchBarActive,
  cart,
  isDropdownOpen,
}) => {
  const [filteredInventory, setFilteredInventory] = useState([]);
  const inputRef = useRef(null);

  const flattenedInventory = Object.values(inventory).flatMap((category) =>
    Object.values(category)
  );

  const handleSearchChange = (e) => {
    if (!e.target.value) {
      setFilteredInventory([]);
      setIsSearchBarActive(false);
      document.body.style.overflow = "unset";
      return;
    }
    setIsSearchBarActive(true);
    const filteredInventory = flattenedInventory.filter((item) =>
      item.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    if (filteredInventory.length > 0) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    setFilteredInventory(filteredInventory);
  };

  const closeSearchBar = () => {
    setIsSearchBarActive(false);
    setFilteredInventory([]);
    document.body.style.overflow = "unset";
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <>
      {isSearchBarActive && (
        <div className="overlay" onClick={closeSearchBar} />
      )}
      <div className={`search-container ${isSearchBarActive ? "active" : ""}`}>
        <div className="search">
          <FontAwesomeIcon
            icon={isSearchBarActive ? faCircleXmark : faSearch}
            className="search-icon"
            onClick={(e) => {
              e.stopPropagation();
              closeSearchBar();
            }}
          />
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
        <div
          className={`search-items ${
            filteredInventory.length === 0 ? "hide" : ""
          }`}
        >
          {filteredInventory.map((item) => (
            <SearchItem
              key={item.id}
              item={item}
              editCart={editCart}
              cart={cart}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default SearchBar;
