import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import Chart from "./components/Chart";
import Footer from "./components/Footer";
import OverlaySpinner from "./components/OverlaySpinner";
import getAngle from "./helpers/getAngle";
import getBaseLayout from "./helpers/getBaseLayout";
import getFrames from "./helpers/getFrames";
import getTraces from "./helpers/getTraces";
import styles from "./helpers/styles";
import useAutoIncrementingCounter from "./hooks/use-auto-incrementing-counter";
import useCovidData from "./hooks/use-covid-data";

const DELTA_DAYS = 7;

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
  } = useAutoIncrementingCounter();
  const {
    byRegionAndDate,
    regions,
    dates,
    loading: loadingRawData,
  } = useCovidData(DELTA_DAYS);
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
      }))
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
          trace.line.color = styles.MAIN_COLOR;
          trace.line.width = 2;
          // } else {
          // trace.line.color = "fuchsia";
          // trace.line.width = 0.5;
        }
      });
      setTraces(newTraces);
      setLayout(frames[day - 1].layout);
      setRevision((r) => r + 1);
    },
    [frames, hoveredTraces, regions]
  );

  useEffect(() => {
    setTraces((oldTraces) => {
      const newTraces = [...oldTraces];
      newTraces.forEach((trace, idx) => {
        if (idx > regions.length) return;

        if (hoveredTraces.has(idx)) {
          trace.line.color = styles.MAIN_COLOR;
          trace.line.width = 2;
        } else {
          trace.line.color = styles.LINE_COLOR;
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
    const regionsIdx = new Set(
      e.points.reduce((r, p) => [...r, p.curveNumber], [])
    );
    setHoveredTraces((t) => new Set([...t].filter((i) => !regionsIdx.has(i))));
  };

  return (
    <div className="font-sans flex flex-no-wrap flex-col justify-between items-center w-full">
      <header className="w-full flex flex-no-wrap flex-col justify-between items-center flex-grow">
        <div className="w-full bg-red-600 shadow-md">
          <p className="animate__animated animate__fadeInDown font-bold text-3xl text-white text-center my-2">
            COVID-19 Growth in Italian Regions
          </p>
        </div>
        <p className="mt-6 px-6 max-w-3xl text-left">
          This interactive chart compares the number of total cases with the
          number of new cases from the previous week. It is plotted using a
          logarithmic scale so that exponential growth is represented by a
          straight line along which cases double every week.
        </p>
      </header>
      <main className="flex justify-center items-center w-full -mt-8">
        <OverlaySpinner
          loading={!chartReady}
          duration={1000}
          onAnimationEnd={useCallback(() => setPageReady(true), [setPageReady])}
        >
          <Chart
            data={traces}
            layout={layout}
            revision={revision}
            onInitialized={(_, graphDiv) => setPlotlyDiv(graphDiv)}
            onHover={handleHover}
            onUnhover={handleUnhover}
            onRelayout={adjustAnnotationAngle}
            sliderValue={currentDay}
            onSliderChange={setCurrentDay}
            sliderMax={numDays - 2}
            date={dates && dayjs(dates[currentDay - 1]).format("MMMM D YYYY")}
            onPlayPauseClick={playing ? pause : play}
            playing={playing}
          />
        </OverlaySpinner>
      </main>
      <Footer />
    </div>
  );
};
