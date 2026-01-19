import React from 'react';

const ContextMenu = ({ isVisible, xPos, yPos, handleClose }) => {
  return (
    <div className="context-menu" style={{ display: isVisible ? 'block' : 'none', position: 'absolute', left: xPos, top: yPos }}>
      <ul>
      <a > <li onClick={handleClose}>Book session</li></a> 
      </ul>
    </div>
  );
};

export default ContextMenu;
