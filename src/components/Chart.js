import Plotly from "plotly.js-basic-dist";
import React from "react";
import createPlotlyComponent from "react-plotly.js/factory";
import styles from "../helpers/styles";
import PlayPause from "./PlayPause";
import Slider from "./Slider";

const Plot = createPlotlyComponent(Plotly);
const plotlyConfig = { modeBarButtons: [[]], displaylogo: false };

const Chart = ({
  className,
  data,
  layout,
  revision,
  onRelayout,
  onHover,
  onUnhover,
  onInitialized,
  date,
  sliderMax,
  sliderValue,
  onSliderChange,
  onPlayPauseClick,
  playing,
}) => (
  <div className={`${className} flex flex-col justify-start items-center`}>
    <Plot
      data={data}
      layout={layout}
      revision={revision}
      useResizeHandler={true}
      onInitialized={onInitialized}
      onHover={onHover}
      onUnhover={onUnhover}
      onRelayout={onRelayout}
      config={plotlyConfig}
      className="w-full h-5/6"
    />
    <div className="flex flex-wrap justify-center items-center w-5/6 mt-4">
      <PlayPause
        onClick={onPlayPauseClick}
        playing={playing}
        className="sm:order-1"
      />
      <span className="order-first sm:order-2 text-center sm:text-xl min-w-full sm:min-w-13rem">
        {date}
      </span>
      <div className="flex-grow ml-6 sm:ml-0 sm:order-3">
        <Slider
          step={1}
          min={0}
          max={sliderMax}
          value={sliderValue}
          onChange={onSliderChange}
          styles={{
            track: {
              flexGrow: 1,
            },
            active: {
              backgroundColor: styles.SECONDARY_COLOR,
            },
            thumb: {
              width: "1.5rem",
              height: "1.5rem",
              backgroundColor: styles.SECONDARY_COLOR,
            },
          }}
        />
      </div>
    </div>
  </div>
);

export default Chart;
