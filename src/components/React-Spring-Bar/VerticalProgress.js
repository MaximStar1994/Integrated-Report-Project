import React from "react";
import { Spring } from "react-spring/renderprops";
import "./VerticalProgress.css";

const VerticalProgress = ({ progress }) => {
  progress = parseFloat(progress).toFixed(0)
  return (
    <Spring from={{ percent: 0 }} to={{ percent: progress }}>
      {({ percent }) => (
        <div className="progress vertical">
          <div style={{ height: `${percent}%` }} className="progress-bar">
    
          </div>
        </div>
      )}
    </Spring>
  );
};

export default VerticalProgress;
