import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import Menu from "../menu/menu";
import "./footer.styles.css";

const Footer = () => {
  const navigate = useNavigate();
  const { firebaseUser, userType } = useAuth();

  const handleClick = (menu) => {
    navigate(menu);
  };

  const links = [
    { label: "About", menu: "/about" },
    { label: "Mission", menu: "/mission" },
    { label: "FAQ", menu: "/faq" },
  ];

  return (
    <div className="footer">
      {(firebaseUser || userType === "guest") && (
        <div className="menu-mobile">
          <Menu />
        </div>
      )}
      <div className="footer-content">
        <div className="footer-links">
          {links.map(({ label, menu }) => (
            <p key={menu} onClick={() => handleClick(menu)}>
              {label}
            </p>
          ))}
        </div>
        <p className="footer-copyright">
          &copy; 2025 Grocery Go. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Footer;
