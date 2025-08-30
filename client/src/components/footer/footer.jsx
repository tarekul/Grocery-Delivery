import { useUI } from "../../contexts/UIContext";
import "./footer.styles.css";

const Footer = () => {
  const { setActiveView } = useUI();

  const handleClick = (menu) => {
    setActiveView(menu);
  };

  const links = [
    { label: "About", menu: "about" },
    { label: "Mission", menu: "mission" },
  ];

  return (
    <div className="footer">
      <div className="footer-links">
        {links.map(({ label, menu }) => (
          <p key={menu} onClick={() => handleClick(menu)}>
            {label}
          </p>
        ))}
      </div>
      <p>&copy; 2025 Grocery Go. All rights reserved.</p>
    </div>
  );
};

export default Footer;
