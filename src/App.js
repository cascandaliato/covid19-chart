import Plotly from 'plotly.js-basic-dist';
import React, { useCallback, useEffect, useState } from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';
import './App.css';
import OverlaySpinner from './components/OverlaySpinner';
import Slider from './components/Slider';
import getFrames from './helpers/getFrames';
import getBaseLayout from './helpers/getBaseLayout';
import getTraces from './helpers/getTraces';
import useCovidData from './hooks/useCovidData';
import useAutoCounter from './hooks/useAutoCounter';

const DELTA_DAYS = 7;

const Plot = createPlotlyComponent(Plotly);

// let throttle = false;

const baseLayout = getBaseLayout();

export default () => {
  const {
    count: currentDay,
    setCount: setCurrentDay,
    setMin: setStartingDay,
    max: numDays,
    setMax: setNumDays,
    setDelayMs,
    playing,
    play,
    pause,
  } = useAutoCounter();
  const { byRegionAndDate, regions, dates, loading: loadingRawData } = useCovidData(DELTA_DAYS);
  const [chartReady, setChartReady] = useState(false);
  const [pageReady, setPageReady] = useState(false);

  const [plotlyDiv, setPlotlyDiv] = useState(null);
  const [frames, setFrames] = useState([{ data: [], layout: {} }]);
  const [{ traces, layout, revision }, setChartData] = useState({
    traces: [],
    layout: {
      responsive: true,
      autosize: true,
    },
    revision: 0,
  });

  // const [figure, setFigure] = useState({
  //   data: [],
  //   layout: getLayout(),
  //   frames: [],
  //   config: {},
  // });

  // create chart
  useEffect(() => {
    if (loadingRawData || chartReady || !plotlyDiv) return;

    setStartingDay(1);
    setNumDays(dates.length);
    setDelayMs(Math.floor(15000 / dates.length));

    setFrames(getFrames(getTraces(byRegionAndDate), regions));
  }, [
    byRegionAndDate,
    regions,
    dates,
    loadingRawData,
    plotlyDiv,
    setStartingDay,
    setNumDays,
    setDelayMs,
    chartReady,
  ]);

  useEffect(() => {
    setChartData({
      traces: frames[0].data,
      layout: { ...baseLayout, ...frames[0].layout },
      revision: 1,
    });
    if (frames.length > 1) setChartReady(true);
  }, [frames]);

  useEffect(() => {
    if (pageReady) play();
  }, [pageReady, play]);

  const updateChart = useCallback(
    (day) =>
      setChartData(({ layout: l, revision: r }) => ({
        traces: frames[day - 1].data,
        layout: { ...baseLayout, ...frames[day - 1].layout },
        revision: r + 1,
      })),
    [frames],
  );

  useEffect(() => {
    if (pageReady) updateChart(currentDay);
  }, [currentDay, pageReady, updateChart]);

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
              data={traces}
              layout={layout}
              revision={revision}
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
              <button onClick={playing ? pause : play}>{playing ? 'Pause' : 'Play'}</button>
              <Slider step={1} min={1} max={numDays} value={currentDay} onChange={setCurrentDay} />
            </div>
          </div>
        </OverlaySpinner>
      </main>
    </div>
  );
};
