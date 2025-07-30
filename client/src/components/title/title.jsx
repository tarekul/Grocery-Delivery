import DarkMode from "../toggle-theme/toggle-theme";
import "./title.styles.css";

const Title = ({
  closeCheckout,
  setMission,
  setShowAbout,
  setShowCancelOrder,
  setShowFAQ,
  setCategory,
}) => {
  const handleTitleClick = () => {
    closeCheckout();
    setMission(false);
    setShowAbout(false);
    setShowCancelOrder(false);
    setShowFAQ(false);
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
