// components/ui/Autocomplete.js
import React, { useState } from "react";
import "./autocomplete.css";

const Autocomplete = ({ options, onChange, placeholder }) => {
  const [search, setSearch] = useState("");
  const [filteredOptions, setFilteredOptions] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setFilteredOptions(
      options.filter((option) =>
        option.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  const handleSelect = (option) => {
    setSearch(option);
    onChange(option);
    setFilteredOptions([]);
  };

  return (
    <div className="autocomplete">
      <input
        type="text"
        value={search}
        onChange={handleChange}
        placeholder={placeholder}
      />
      {filteredOptions.length > 0 && (
        <ul className="autocomplete-list">
          {filteredOptions.map((option, index) => (
            <li key={index} onClick={() => handleSelect(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export { Autocomplete };
