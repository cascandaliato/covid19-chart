import React from 'react';

export default ({ min, max, step, value, onChange }) => {
  return (
    <div style={{ flexGrow: 1, display: 'flex' }}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(+e.target.value)}
        style={{ width: '100%', flexGrow: 1 }}
      />
    </div>
  );
};
