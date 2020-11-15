import React from "react";
import Slider from "react-input-slider";
import ownStyles from "./Slider.module.css";

export default ({ min, max, step, value, onChange, styles }) => {
  return (
    <div className={`${ownStyles.slider} flex flex-grow`}>
      <Slider
        xmin={min}
        xmax={max}
        xstep={step}
        x={value}
        onChange={(v) => onChange(v.x)}
        styles={styles}
      />
    </div>
  );
};
