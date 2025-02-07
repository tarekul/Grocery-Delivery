const distanceCalculator = (zipcode) => {
  switch (zipcode) {
    case "11416":
      return 3.99;
    case "11418":
      return 4.99;
    case "11419":
      return 4.99;
    case "11421":
      return 4.99;
    case "11208":
      return 4.99;
    default:
      return 5.99;
  }
};

export default distanceCalculator;
