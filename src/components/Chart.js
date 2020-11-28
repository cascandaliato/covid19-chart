import Plotly from "plotly.js-basic-dist";
import React from "react";
import createPlotlyComponent from "react-plotly.js/factory";
import PlayPause from "./PlayPause";
import Slider from "./Slider";
import styles from "../helpers/styles";

const Plot = createPlotlyComponent(Plotly);
const plotlyConfig = { modeBarButtons: [[]], displaylogo: false };

const Chart = ({
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
  <div className="flex flex-col justify-evenly items-center w-5/6">
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
      className="w-full"
    />
    <div className="flex flex-wrap justify-center items-center w-4/5 mt-6">
      <PlayPause onClick={onPlayPauseClick} playing={playing} />
      <span className="text-center text-xl min-w-13rem">{date}</span>
      <div className="flex-grow min-w-16 mt-6 sm:mt-0">
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
