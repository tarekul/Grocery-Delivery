import { useUI } from "../../contexts/UIContext";
import DarkMode from "../toggle-theme/toggle-theme";
import "./title.styles.css";

const Title = () => {
  const { closeCheckout, setCategory, setActiveMenu } = useUI();
  const handleTitleClick = () => {
    closeCheckout();
    setCategory(null);
    setActiveMenu(null);
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
