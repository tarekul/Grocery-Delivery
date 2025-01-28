import "./title.styles.css";

const Title = ({ closeCheckout, setMission }) => {
  const handleTitleClick = () => {
    closeCheckout();
    setMission(false);
  };
  return (
    <h1 className="title" onClick={handleTitleClick}>
      Grocery Go
    </h1>
  );
};

export default Title;
