import React from "react";
import "./zip-dropdown.styles.css";

const ZipDropdown = ({ setZipcode, disabled }) => {
  const handleChange = (e) => {
    setZipcode(e.target.value);
  };

  return (
    <div className="zip-dropdown">
      <select onChange={handleChange} disabled={disabled}>
        <option value="zip1">11416 (Ozone Park, NY)</option>
        <option value="zip2">11418 (Richmond Hill, NY)</option>
        <option value="zip3">11419 (South Richmond Hill, NY)</option>
        <option value="zip4">11421 (Woodhaven, NY)</option>
        <option value="zip5">11208 (Brooklyn, NY)</option>
      </select>
    </div>
  );
};

export default ZipDropdown;
