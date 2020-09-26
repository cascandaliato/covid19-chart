import dayjs from 'dayjs';
import Plotly from 'plotly.js-basic-dist';
import React, { useCallback, useEffect, useState } from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';
import './App.css';
import Footer from './components/Footer';
import OverlaySpinner from './components/OverlaySpinner';
import Slider from './components/Slider';
import getAngle from './helpers/getAngle';
import getBaseLayout from './helpers/getBaseLayout';
import getFrames from './helpers/getFrames';
import getTraces from './helpers/getTraces';
import useAutoCounter from './hooks/useAutoCounter';
import useCovidData from './hooks/useCovidData';

const DELTA_DAYS = 7;

const Plot = createPlotlyComponent(Plotly);

// let throttle = false;

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
  const [traces, setTraces] = useState([]);
  const [layout, setLayout] = useState({
    responsive: true,
    autosize: true,
  });
  const [revision, setRevision] = useState(0);

  // create chart
  useEffect(() => {
    if (loadingRawData || !plotlyDiv) return;

    setStartingDay(1);
    setNumDays(dates.length);
    // setDelayMs(Math.floor(15000 / dates.length));
    setDelayMs(50);

    const baseLayout = getBaseLayout(byRegionAndDate);
    setFrames(
      getFrames(getTraces(byRegionAndDate, dates), regions).map((f) => ({
        ...f,
        layout: { ...baseLayout, ...f.layout },
      })),
    );
  }, [
    byRegionAndDate,
    regions,
    dates,
    loadingRawData,
    plotlyDiv,
    setStartingDay,
    setNumDays,
    setDelayMs,
  ]);

  useEffect(() => {
    if (chartReady) return;
    setTraces(frames[0].data);
    setLayout(frames[0].layout);
    setRevision((r) => r + 1);
    if (frames.length > 1) setChartReady(true);
  }, [frames, chartReady]);

  const adjustAnnotationAngle = useCallback(() => {
    if (!chartReady) return;
    setFrames((oldFrames) => {
      const newFrames = [...oldFrames];
      newFrames.forEach((frame) => {
        frame.layout.annotations[0].visible = true;
        frame.layout.annotations[0].textangle = getAngle();
      });
      return newFrames;
    });
  }, [chartReady]);

  useEffect(() => {
    if (pageReady) {
      adjustAnnotationAngle();
      play();
    }
  }, [pageReady, play, adjustAnnotationAngle]);

  const updateChart = useCallback(
    (day) => {
      setTraces(frames[day - 1].data);
      setLayout(frames[day - 1].layout);
      setRevision((r) => r + 1);
    },
    [frames],
  );

  useEffect(() => {
    if (pageReady) updateChart(currentDay);
  }, [currentDay, pageReady, updateChart]);

  const handleHover = (color, width) => (e) => {
    const regionsIdx = e.points.reduce((r, p) => [...r, p.curveNumber], []);
    setFrames((oldFrames) => {
      const newFrames = [...oldFrames];
      newFrames.forEach(({ data }) =>
        regionsIdx.forEach((idx) => {
          data[idx].line.color = color;
          data[idx].line.width = width;
        }),
      );
      return newFrames;
    });
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
      <header
        style={{
          flexDirection: 'column',
          flexWrap: 'nowrap',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h1>COVID-19 Growth in Italian Regions</h1>
        <p>Some text here</p>
        <p>Some more text here</p>
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
              onHover={handleHover('fuchsia', 2)}
              onUnhover={handleHover('gray', 0.5)}
              onRelayouting={() => console.log('onRelayouting')}
              onRelayout={adjustAnnotationAngle}
              style={{ width: '100%' }}
              config={{ modeBarButtons: [[]], displaylogo: false }}
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
              {dates && dayjs(dates[currentDay - 1]).format('MMMM D YYYY')}
              <Slider step={1} min={1} max={numDays} value={currentDay} onChange={setCurrentDay} />
            </div>
          </div>
        </OverlaySpinner>
      </main>
      <Footer />
    </div>
  );
};
