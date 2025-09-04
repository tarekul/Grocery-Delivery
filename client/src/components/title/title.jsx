import { useNavigate } from "react-router-dom";
import { useUI } from "../../contexts/UIContext";
import DarkMode from "../toggle-theme/toggle-theme";
import "./title.styles.css";

const Title = () => {
  const navigate = useNavigate();
  const { setCategory } = useUI();

  const handleTitleClick = () => {
    navigate("/");
    setCategory(null);
  };
  return (
    <div className="title-container">
      <h1 className="title" onClick={handleTitleClick}>
        Grocery G
      </h1>
      <DarkMode />
    </div>
  );
};

export default Title;
