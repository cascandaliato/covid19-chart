import dayjs from 'dayjs';
import Plotly from 'plotly.js-basic-dist';
import React, { useCallback, useEffect, useState } from 'react';
import createPlotlyComponent from 'react-plotly.js/factory';
import Footer from './components/Footer';
import OverlaySpinner from './components/OverlaySpinner';
import PlayPause from './components/PlayPause';
import Slider from './components/Slider';
import { inputControlColors } from './helpers/colors';
import getAngle from './helpers/getAngle';
import getBaseLayout from './helpers/getBaseLayout';
import getFrames from './helpers/getFrames';
import getTraces from './helpers/getTraces';
import useAutoCounter from './hooks/useAutoCounter';
import useBodyClasses from './hooks/useBodyClasses';
import useCovidData from './hooks/useCovidData';

const DELTA_DAYS = 7;

const Plot = createPlotlyComponent(Plotly);

const plotlyConfig = { modeBarButtons: [[]], displaylogo: false };

// let throttle = false;

export default () => {
  // useBodyClasses('bg-gradient-to-b', 'from-white', 'via-gray-100', 'to-white');
  // useBodyClasses('bg-gray-100');

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
  const [hoveredTraces, setHoveredTraces] = useState(new Set());

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
      const newTraces = frames[day - 1].data;
      newTraces.forEach((trace, idx) => {
        if (idx > regions.length) return;

        if (hoveredTraces.has(idx)) {
          trace.line.color = '#e53e3e';
          trace.line.width = 2;
        } else {
          trace.line.color = 'gray';
          trace.line.width = 0.5;
        }
      });
      setTraces(newTraces);
      setLayout(frames[day - 1].layout);
      setRevision((r) => r + 1);
    },
    [frames, hoveredTraces, regions],
  );

  useEffect(() => {
    setTraces((oldTraces) => {
      const newTraces = [...oldTraces];
      newTraces.forEach((trace, idx) => {
        if (idx > regions.length) return;

        if (hoveredTraces.has(idx)) {
          trace.line.color = '#e53e3e';
          trace.line.width = 2;
        } else {
          trace.line.color = '#2d3748';
          trace.line.width = 0.5;
        }
      });
      return newTraces;
    });
  }, [hoveredTraces, regions]);

  useEffect(() => {
    if (pageReady) updateChart(currentDay);
  }, [currentDay, pageReady, updateChart]);

  const handleHover = (e) => {
    const regionsIdx = e.points.reduce((r, p) => [...r, p.curveNumber], []);
    setHoveredTraces((t) => new Set([...t, ...regionsIdx]));
  };

  const handleUnhover = (e) => {
    const regionsIdx = new Set(e.points.reduce((r, p) => [...r, p.curveNumber], []));
    setHoveredTraces((t) => new Set([...t].filter((i) => !regionsIdx.has(i))));
  };

  return (
    <div
      className="font-sans"
      style={{
        flexDirection: 'column',
        flexWrap: 'nowrap',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100vw',
        minHeight: '100vh',
      }}
    >
      <div
        className="font-sans"
        style={{
          flexDirection: 'column',
          flexWrap: 'nowrap',
          display: 'flex',
          justifyContent: 'start',
          alignItems: 'center',
          width: '100vw',
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
          <h1 className="font-bold text-3xl text-red-600">COVID-19 Growth in Italian Regions</h1>
          <p>Some text here</p>
          <p>Some more text here</p>
        </header>
        <main
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            // flexGrow: 1,
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
                // flexGrow: 1,
                width: '100%',
                // height: '100%',
              }}
            >
              <Plot
                data={traces}
                layout={layout}
                revision={revision}
                useResizeHandler={true}
                onInitialized={(_, graphDiv) => setPlotlyDiv(graphDiv)}
                // onUpdate={setFigure}
                onHover={handleHover}
                onUnhover={handleUnhover}
                onRelayout={adjustAnnotationAngle}
                style={{ width: '100%' }}
                config={plotlyConfig}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '80%',
                }}
                className="mt-4"
              >
                <PlayPause onClick={playing ? pause : play} playing={playing} />
                <span style={{ minWidth: '15rem' }} className="text-center text-2xl ">
                  {dates && dayjs(dates[currentDay - 1]).format('MMMM D YYYY')}
                </span>
                <Slider
                  step={1}
                  min={0}
                  max={numDays - 2}
                  value={currentDay}
                  onChange={setCurrentDay}
                  styles={{
                    track: {
                      width: '100%',
                    },
                    active: {
                      backgroundColor: inputControlColors,
                    },
                    thumb: {
                      width: '1.5rem',
                      height: '1.5rem',
                      backgroundColor: inputControlColors,
                    },
                  }}
                />
              </div>
            </div>
          </OverlaySpinner>
        </main>
      </div>
      <Footer />
    </div>
  );
};
