import brandImage from "../../assets/brandImage.jpg";
import brandImage2 from "../../assets/brandImage2.jpg";
import brandImage3 from "../../assets/brandImage3.jpg";
import brandImage4 from "../../assets/brandImage4.jpg";
import "./brand-welcome.styles.css";

const BrandWelcome = () => {
  return (
    <div className="brand-welcome">
      <div className="card">
        <img className="brand-image" src={brandImage} alt="" />
      </div>
      <div className="card">
        <img className="brand-image" src={brandImage2} alt="" />
      </div>
      <div className="card">
        <img className="brand-image" src={brandImage3} alt="" />
      </div>
      <div className="card">
        <img className="brand-image" src={brandImage4} alt="" />
      </div>
    </div>
  );
};

export default BrandWelcome;
