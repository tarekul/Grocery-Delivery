import React, { useState } from 'react';
import './category-selector.styles.css';

const CategorySelector = ({ getInventoryByCategory }) => {
    const categories = ['All', 'Grains', 'Lentils', 'Spices', 'Vegetables', 'Dairy', 'Fruits', 'Miscellaneous'];
    const [showOptions, setShowOptions] = useState(false);

    const handleCategoryChange = (category) => {
        getInventoryByCategory(category);
    }

    return (
        <div className="category-container">
            <button className="category-title" onClick={() => setShowOptions(!showOptions)}>Browse Categories</button>
            {showOptions && (<div className="categories">
                {categories.map((category, index) => (
                        <button key={index} className="category-filter" onClick={() => handleCategoryChange(category)}>{category}</button>
                    ))}
            </div>)}
        </div>
  )
}

export default CategorySelector;