import "./title.styles.css";

const Title = ({ closeCheckout }) => {
  return (
    <h1 className="title" onClick={() => closeCheckout()}>
      Grocery Go
    </h1>
  );
};

export default Title;
