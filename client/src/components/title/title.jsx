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
    <h1 className="title" onClick={handleTitleClick}>
      Grocery Go
    </h1>
  );
};

export default Title;
