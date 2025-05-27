import React from "react";
import "./Input.css";

const Input = ({ label, placeholder }) => {
  return (
    <div className="input-container">
      <label>{label}</label>
      <input type="text" placeholder={placeholder} />
    </div>
  );
};

export default Input;
