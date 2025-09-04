import {
  Amphora,
  Apple,
  Bean,
  Carrot,
  Cookie,
  CookingPot,
  Refrigerator,
  Wheat,
} from "lucide-react";
import "./categories.styles.css";

const Categories = ({ setCategory }) => {
  const handleCategoryClick = (category) => {
    setCategory(category);
  };

  return (
    <div className="categories">
      <button
        className="category-button"
        title="Cold Products"
        onClick={() => handleCategoryClick("Cold Products")}
      >
        <Refrigerator size={50} />
      </button>
      <button className="category-button disabled" title="Coming soon">
        <Carrot size={50} />
      </button>
      <button className="category-button disabled" title="Coming soon">
        <Apple size={50} />
      </button>
      <button className="category-button disabled" title="Coming soon">
        <Wheat size={50} />
      </button>
      <button className="category-button disabled" title="Coming soon">
        <Bean size={50} />
      </button>
      <button className="category-button disabled" title="Coming soon">
        <CookingPot size={50} />
      </button>
      <button className="category-button disabled" title="Coming soon">
        <Amphora size={50} />
      </button>
      <button className="category-button disabled" title="Coming soon">
        <Cookie size={50} />
      </button>
    </div>
  );
};

export default Categories;
