import "../styles/InputForm.css";
import React from "react";

const InputPercentage = ({ currPercentage, handlePercentageChange }) => {
  return (
    <div className="input-field">
      <label>Percentage:</label>
      <input
        type="number"
        min={0.01}
        step={0.01}
        max={100.0}
        name="percentage"
        value={currPercentage ? currPercentage : ""}
        onChange={handlePercentageChange}
        className="input-field-text"
        placeholder="Percentage"
      />
    </div>
  );
};

export default InputPercentage;
