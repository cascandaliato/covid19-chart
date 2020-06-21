import React from 'react';
import Plot from 'react-plotly.js';
import styles from './Chart.module.css';

export default ({ data, layout, frames }) => {
  console.log('new layout', layout);
  return (
    <Plot
      className={styles.chart}
      useResizeHandler={true}
      data={data}
      layout={layout}
      frames={frames}
    />
  );
  
      // if (this.resizeHandler && isBrowser) {
      //   window.removeEventListener('resize', this.resizeHandler);
      //   this.resizeHandler = null;
      // }

      // this.removeUpdateEvents();

      // Plotly.purge(this.el);
};
