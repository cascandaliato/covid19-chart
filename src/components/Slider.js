import React from 'react';

export default ({ min, max, step, value, onChange }) => {
  return (
    <>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
      />
    </>
  );
};