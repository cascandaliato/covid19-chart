import React from "react";
import ReactInputSlider from "react-input-slider";
import ownStyles from "./Slider.module.css";

const Slider = ({ min, max, step, value, onChange, styles }) => {
  return (
    <div className={`${ownStyles.slider} flex flex-grow hover:cursor-pointer`}>
      <ReactInputSlider
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

export default Slider;
