import "./menu.styles.css";

const Menu = () => {
  const handleMenuClick = () => {
    console.log("clicked");
    const nav = document.querySelector("nav");
    nav.classList.toggle("show");
  };

  return (
    <>
      <nav>
        <ul>
          <li>Mission</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
      </nav>
      <i className="fa-solid fa-bars fa-lg" onClick={handleMenuClick}></i>
    </>
  );
};

export default Menu;
