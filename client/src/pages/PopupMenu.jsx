import React from 'react';
import './PopupMenu.css';

const PopupMenu = ({ onSelect, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h3>Select Format</h3>
        <button onClick={() => onSelect('csv')}>CSV</button>
        <button onClick={() => onSelect('json')}>JSON</button>
        <button onClick={() => onSelect('pdf')}>PDF</button>
        <button className="close-btn" onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default PopupMenu;
