import Plotly from 'plotly.js-basic-dist';
import React, { useCallback, useEffect, useState } from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';
import Slider from './components/Slider';
import getFrames from './helpers/getFrames';
import getLayout from './helpers/getLayout';
import getTraces from './helpers/getTraces';
import useCovidData from './hooks/useCovidData';

const DELTA_DAYS = 7;

const Plot = createPlotlyComponent(Plotly);

let throttle = false;

export default () => {
  const { byRegionAndDate, regions, dates, loading } = useCovidData(DELTA_DAYS);
  const [ready, setReady] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);
  const [numDays, setNumDays] = useState(1);
  const [plotlyDiv, setPlotlyDiv] = useState(null);
  const [chartData, setChartData] = useState([{}]);
  const [chartLayout, setChartLayout] = useState({
    responsive: true,
    autosize: true,
  });
  const [chartFrames, setChartFrames] = useState([]);
  const [chartRevision, setChartRevision] = useState(0);
  const [updateTimer, setUpdateTimer] = useState(null);
  const [paused, setPaused] = useState(false);

  // const [figure, setFigure] = useState({
  //   data: [],
  //   layout: getLayout(),
  //   frames: [],
  //   config: {},
  // });

  const resumeTimer = useCallback(() => {
    const timer = setTimeout(() => {
      setCurrentDay((day) => Math.min(day + 1, numDays));
    }, Math.floor(15000 / numDays));
    setUpdateTimer(timer);
    return timer;
  }, [numDays]);

  const stopTimer = () => {
    if (!updateTimer) return;

    clearTimeout(updateTimer);
    setUpdateTimer(null);
  };

  const updateChart = useCallback(
    (day) => {
      setChartData(chartFrames[day - 1].data);
      setChartLayout((layout) => ({ ...layout, ...chartFrames[day - 1].layout }));
      setChartRevision((rev) => rev + 1);
    },
    [chartFrames],
  );

  useEffect(() => {
    if (loading || !plotlyDiv) return;

    const traces = getTraces(byRegionAndDate);
    const frames = getFrames(traces, regions);
    const layout = { ...getLayout(), ...frames[0].layout };

    setNumDays(dates.length);
    setChartData(traces);
    setChartLayout(layout);
    setChartFrames(frames);
    // setChartTraces(traces);
    setReady(true);
  }, [byRegionAndDate, regions, dates, loading, plotlyDiv]);

  useEffect(() => {
    if (!ready || paused) return;
    const timer = resumeTimer();
    return () => clearTimeout(timer);
  }, [ready, currentDay, resumeTimer, paused]);

  useEffect(() => {
    if (!ready) return;
    updateChart(currentDay);
  }, [ready, currentDay, updateChart]);

  const handleSliderChange = useCallback((day) => {
    setCurrentDay(day);

    if (throttle) return;
    throttle = true;
    setTimeout(() => (throttle = false), 20);
  }, []);

  const playPause = () => {
    if (paused) {
      setPaused(false);
      setCurrentDay((day) => Math.min(day + 1, numDays));
      resumeTimer();
    } else {
      setPaused(true);
      stopTimer();
    }
  };

  return (
    <>
      <header>
        <h1>COVID-19 Growth in Italian Regions</h1>
        <h6>Simulation: day {currentDay}</h6>
      </header>
      <main>
        <Plot
          data={chartData}
          layout={chartLayout}
          revision={chartRevision}
          useResizeHandler={true}
          onInitialized={(_, graphDiv) => setPlotlyDiv(graphDiv)}
          // onUpdate={setFigure}
          style={{ width: '100%' }}
        />
        <button onClick={playPause}>{updateTimer ? 'Pause' : 'Play'}</button>
        <Slider step={1} min={1} max={numDays} value={currentDay} onChange={handleSliderChange} />
      </main>
    </>
  );
};
