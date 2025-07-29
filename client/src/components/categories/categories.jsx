import {
  Amphora,
  Apple,
  Bean,
  Carrot,
  Cookie,
  CookingPot,
  Milk,
  Wheat,
} from "lucide-react";
import "./categories.styles.css";

const Categories = ({ setCategory }) => {
  const handleCategoryClick = (category) => {
    setCategory(category);
  };

  return (
    <div>
      <h2>Categories</h2>
      <div className="categories">
        <button
          className="category-button"
          title="Cold Products"
          onClick={() => handleCategoryClick("Cold Products")}
        >
          <Milk />
          Cold Products
        </button>
        <button className="category-button disabled" title="Coming soon">
          <Carrot />
          Fresh Produce
        </button>
        <button className="category-button disabled" title="Coming soon">
          <Apple />
          Fruits
        </button>
        <button className="category-button disabled" title="Coming soon">
          <Wheat />
          Grains
        </button>
        <button className="category-button disabled" title="Coming soon">
          <Bean />
          Lentils & Beans
        </button>
        <button className="category-button disabled" title="Coming soon">
          <CookingPot />
          Spices & Masalas
        </button>
        <button className="category-button disabled" title="Coming soon">
          <Amphora />
          Cooking Oils
        </button>
        <button className="category-button disabled" title="Coming soon">
          <Cookie />
          Snacks & Sweets
        </button>
      </div>
    </div>
  );
};

export default Categories;
