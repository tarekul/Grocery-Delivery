import { CircleX, Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../contexts/cartContext";
import { useUI } from "../../contexts/UIContext";
import SearchItem from "../search-bar/search-item";
import "./search-bar.styles.css";

const SearchBar = () => {
  const { cart, cartEditor } = useCart();
  const { inventory, isCartOpen, toggleSearch, isSearchOpen, isClosingSearch } =
    useUI();
  const navigate = useNavigate();

  const [filteredInventory, setFilteredInventory] = useState([]);
  const [searchText, setSearchText] = useState("");
  const inputRef = useRef(null);

  const flattenedInventory = useMemo(
    () =>
      Object.values(inventory).flatMap((category) => Object.values(category)),
    [inventory]
  );

  useEffect(() => {
    return () => {
      if (window.innerWidth <= 768) {
        document.body.style.overflow = "unset";
      }
    };
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    if (!value) {
      setFilteredInventory([]);
      document.body.style.overflow = "unset";
      navigate("/");
      return;
    }
    const filtered = flattenedInventory.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );

    if (filtered.length > 0) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    setFilteredInventory(filtered);
    console.log(filtered);
  };

  const hasItems = filteredInventory.length > 0 ? "has-items" : "";

  return (
    <>
      <div className="search-container">
        {isSearchOpen && (
          <div
            className={`search-dropdown ${
              isClosingSearch ? "closing" : ""
            } ${hasItems}`}
          >
            <div className="search">
              {searchText.length === 0 ? (
                <Search
                  size={20}
                  className="search-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSearch();
                  }}
                />
              ) : (
                <X
                  size={20}
                  className="search-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSearch();
                  }}
                />
              )}
              <input
                ref={inputRef}
                className="search-input"
                type="text"
                placeholder="Search for items..."
                name="search"
                value={searchText}
                onChange={handleSearchChange}
                autoComplete="off"
                disabled={isCartOpen}
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
                  editCart={cartEditor}
                  cart={cart}
                />
              ))}
            </div>
            <CircleX
              className="search-close-button"
              size={30}
              onClick={toggleSearch}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default SearchBar;
