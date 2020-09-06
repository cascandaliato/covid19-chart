import Plotly from 'plotly.js-basic-dist';
import React, { useCallback, useEffect, useState } from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';
import './App.css';
import OverlaySpinner from './components/OverlaySpinner';
import Slider from './components/Slider';
import getFrames from './helpers/getFrames';
import getLayout from './helpers/getLayout';
import getTraces from './helpers/getTraces';
import useCovidData from './hooks/useCovidData';

const DELTA_DAYS = 7;

const Plot = createPlotlyComponent(Plotly);

let throttle = false;

export default () => {
  const { byRegionAndDate, regions, dates, loading: loadingRawData } = useCovidData(DELTA_DAYS);
  const [chartReady, setChartReady] = useState(false);
  const [pageReady, setPageReady] = useState(false);

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

  const [timer, setTimer] = useState(null);
  const [paused, setPaused] = useState(false);

  // const [figure, setFigure] = useState({
  //   data: [],
  //   layout: getLayout(),
  //   frames: [],
  //   config: {},
  // });

  const resumeTimer = useCallback(() => {
    const t = setTimeout(() => {
      setCurrentDay((day) => Math.min(day + 1, numDays));
    }, Math.floor(15000 / numDays));
    setTimer(t);
    return t;
  }, [numDays]);

  const stopTimer = () => {
    if (!timer) return;

    clearTimeout(timer);
    setTimer(null);
  };

  const updateChart = useCallback(
    (day) => {
      setChartData(chartFrames[day - 1].data);
      setChartLayout((layout) => ({ ...layout, ...chartFrames[day - 1].layout }));
      setChartRevision((rev) => rev + 1);
    },
    [chartFrames],
  );

  // create chart
  useEffect(() => {
    if (loadingRawData || !plotlyDiv) return;

    const traces = getTraces(byRegionAndDate);
    const frames = getFrames(traces, regions);
    const layout = { ...getLayout(), ...frames[0].layout };

    setNumDays(dates.length);
    setChartData(traces);
    setChartLayout(layout);
    setChartFrames(frames);

    setChartReady(true);
  }, [byRegionAndDate, regions, dates, loadingRawData, plotlyDiv]);

  useEffect(() => {
    if (!pageReady || paused) return;
    const t = resumeTimer();
    return () => clearTimeout(t);
  }, [pageReady, currentDay, resumeTimer, paused]);

  useEffect(() => {
    if (!pageReady) return;
    updateChart(currentDay);
  }, [pageReady, currentDay, updateChart]);

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
    <div
      style={{
        flexDirection: 'column',
        flexWrap: 'nowrap',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100vh',
      }}
    >
      <header>
        <h1>COVID-19 Growth in Italian Regions</h1>
        <h6>Simulation: day {currentDay}</h6>
      </header>
      <main
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          flexGrow: 1,
          width: '100%',
        }}
      >
        <OverlaySpinner
          loading={!chartReady}
          duration={1000}
          onAnimationEnd={useCallback(() => setPageReady(true), [setPageReady])}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-evenly',
              alignItems: 'center',
              flexGrow: 1,
              width: '100%',
              height: '100%',
            }}
          >
            <Plot
              data={chartData}
              layout={chartLayout}
              revision={chartRevision}
              useResizeHandler={true}
              onInitialized={(_, graphDiv) => setPlotlyDiv(graphDiv)}
              // onUpdate={setFigure}
              style={{ width: '100%' }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <button onClick={playPause}>{timer ? 'Pause' : 'Play'}</button>
              <Slider
                step={1}
                min={1}
                max={numDays}
                value={currentDay}
                onChange={handleSliderChange}
              />
            </div>
          </div>
        </OverlaySpinner>
      </main>
    </div>
  );
};
