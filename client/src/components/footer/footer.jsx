import "./footer.styles.css";

const Footer = ({ setShowMission, setShowAbout, closeCheckout }) => {
  const handleMissionClick = () => {
    setShowMission(true);
    setShowAbout(false);
    closeCheckout();
  };

  const handleAboutClick = () => {
    setShowAbout(true);
    setShowMission(false);
    closeCheckout();
  };
  return (
    <div className="footer">
      <div className="footer-links">
        <p onClick={handleAboutClick}>About</p>
        <p onClick={handleMissionClick}>Mission</p>
      </div>
      <p>&copy; 2025 Grocery Go. All rights reserved.</p>
    </div>
  );
};

export default Footer;
