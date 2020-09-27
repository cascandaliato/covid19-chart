import React from 'react';
import Slider from 'react-input-slider';
import styless from './Slider.module.css';

export default ({ min, max, step, value, onChange, styles }) => {
  return (
    <div style={{ flexGrow: 1, display: 'flex' }} className={styless.slider}>
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
