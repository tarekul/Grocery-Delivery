import { useAuth } from "../../contexts/authContext";
import Menu from "../menu/menu";
import Title from "../title/title";
import "./header.styles.css";

const Header = () => {
  const { firebaseUser, userType } = useAuth();
  return (
    <div className="header">
      <Title />
      {(firebaseUser || userType === "guest") && (
        <div className="menu-desktop">
          <Menu />
        </div>
      )}
    </div>
  );
};

export default Header;
