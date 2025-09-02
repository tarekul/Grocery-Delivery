import React from "react";
import "./zip-dropdown.styles.css";
import { set } from "firebase/database";

const ZipDropdown = ({ zipcode, setZipcode, disabled }) => {
  const [selected, setSelected] = React.useState(zipcode ? String(zipcode) : "11416");
  const handleChange = (e) => {
    console.log(e.target.value);
    setSelected(String(e.target.value));
    setZipcode(String(e.target.value));
  };
  const zips = ["11416","11414","11418","11419","11421","11208"];
  

  return (
    <div className="zip-dropdown">
      <select value={selected} onChange={handleChange} disabled={disabled}>
        <option value="" disabled>Select zip</option>
        {zips.map(z => (
          <option key={z} value={z}>{z}</option>
        ))}
      </select>
    </div>
  );
};

export default ZipDropdown;
