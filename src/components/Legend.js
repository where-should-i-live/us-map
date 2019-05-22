import React from "react";

function Legend() {
  return (
    <div className="instructions">
      <div className="legend">
        <div className="color-box cb1" />
        <div className="color-box cb2" />
        <div className="color-box cb3" />
        <div className="color-box cb4" />
        <div className="color-box cb5" />
        <div className="color-box cb6" />
        <div className="color-box cb7" />
        <div className="color-box cb8" />
        <div className="color-box cb9" />
      </div>
      <div className="legend-explanation">
        <p>Least Similar</p>
        <div className="legend-line"/>
        <p>Most Similar</p>
      </div>
    </div>
  );
}

export default Legend;
