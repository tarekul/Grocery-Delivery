import "./title.styles.css";

const Title = ({ closeCheckout, setMission, setShowAbout }) => {
  const handleTitleClick = () => {
    closeCheckout();
    setMission(false);
    setShowAbout(false);
  };
  return (
    <h1 className="title" onClick={handleTitleClick}>
      Grocery Go
    </h1>
  );
};

export default Title;
