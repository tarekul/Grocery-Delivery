import "./title.styles.css";

const Title = ({
  closeCheckout,
  setMission,
  setShowAbout,
  setShowCancelOrder,
  setShowFAQ,
}) => {
  const handleTitleClick = () => {
    closeCheckout();
    setMission(false);
    setShowAbout(false);
    setShowCancelOrder(false);
    setShowFAQ(false);
  };
  return (
    <h1 className="title" onClick={handleTitleClick}>
      Grocery Go
    </h1>
  );
};

export default Title;
