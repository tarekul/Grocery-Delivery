import apiUrl from "./apiUrl";

if (localStorage.getItem("shelfImageMap") === null) {
  localStorage.setItem(
    "shelfImageMap",
    JSON.stringify({
      dairy_shelf_1: `${apiUrl}/shelf-images/dairy-shelf-1.jpg`,
    })
  );
}

const shelfImageMap = localStorage.getItem("shelfImageMap")
  ? JSON.parse(localStorage.getItem("shelfImageMap"))
  : {
      dairy_shelf_1: `${apiUrl}/shelf-images/dairy-shelf-1.jpg`,
    };

export default shelfImageMap;
