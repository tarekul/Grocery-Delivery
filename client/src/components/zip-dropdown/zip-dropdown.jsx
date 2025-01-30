import React from "react";
import "./zip-dropdown.styles.css";

const ZipDropdown = ({ setZipcode, disabled }) => {
  const handleChange = (e) => {
    setZipcode(e.target.value);
  };

  return (
    <div className="zip-dropdown">
      <select onChange={handleChange} disabled={disabled}>
        <option value="11416">11416</option>
        <option value="11418">11418</option>
        <option value="11419">11419</option>
        <option value="11421">11421</option>
        <option value="11208">11208</option>
      </select>
    </div>
  );
};

export default ZipDropdown;
