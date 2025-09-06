import cold from "../../assets/categoryImages/cold.jpeg";
import fruits from "../../assets/categoryImages/fruits.jpeg";
import lentils from "../../assets/categoryImages/lentils.jpeg";
import oils from "../../assets/categoryImages/oils.jpeg";
import rice from "../../assets/categoryImages/rice.jpeg";
import snacks from "../../assets/categoryImages/snacks.jpeg";
import spices from "../../assets/categoryImages/spices.jpeg";
import vegetables from "../../assets/categoryImages/vegetables.jpeg";
import "./categories.styles.css";

const Categories = ({ setCategory }) => {
  const handleCategoryClick = (category) => {
    setCategory(category);
  };

  return (
    <div className="categories">
      <img
        src={cold}
        alt=""
        onClick={() => handleCategoryClick("Cold Products")}
      />
      <img src={fruits} alt="" />
      <img src={lentils} alt="" />
      <img src={oils} alt="" />
      <img src={rice} alt="" />
      <img src={vegetables} alt="" />
      <img src={snacks} alt="" />
      <img src={spices} alt="" />
    </div>
  );
};

export default Categories;
