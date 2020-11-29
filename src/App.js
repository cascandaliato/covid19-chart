import dayjs from "dayjs";
import React, { useCallback, useEffect, useState } from "react";
import Chart from "./components/Chart";
import Footer from "./components/Footer";
import OverlaySpinner from "./components/OverlaySpinner";
import RegionsFilter from "./components/RegionsFilter";
import getAngle from "./helpers/get-angle";
import getBaseLayout from "./helpers/get-base-layout";
import getFrames from "./helpers/get-frames";
import getTraces from "./helpers/get-traces";
import styles from "./helpers/styles";
import useAutoIncrementingCounter from "./hooks/use-auto-incrementing-counter";
import useCovidData from "./hooks/use-covid-data";

const DELTA_DAYS = 7;
const EMPTY_SET = new Set();

const App = () => {
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
  const [selectedRegions, setSelectedRegions] = useState(EMPTY_SET);
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

  useEffect(() => {
    if (regions) {
      setSelectedRegions(new Set(regions));
    }
  }, [regions]);

  // create chart
  useEffect(() => {
    if (loadingRawData || !plotlyDiv) return;

    setStartingDay(1);
    setNumDays(dates.length);
    setDelayMs(100);

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
        frame.layout.annotations[regions.length].visible = true;
        frame.layout.annotations[regions.length].textangle = getAngle();
      });
      return newFrames;
    });
  }, [chartReady, regions]);

  useEffect(() => {
    if (pageReady) {
      adjustAnnotationAngle();
      play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageReady, adjustAnnotationAngle]);

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
    if (!pageReady) return;

    const currentFrame = frames[currentDay - 1];

    regions.forEach((region, idx) => {
      const isRegionVisible = selectedRegions.has(region);
      currentFrame.layout.annotations[idx].visible = isRegionVisible;
      currentFrame.data[idx].visible = isRegionVisible;
      currentFrame.data[idx + regions.length].visible = isRegionVisible;
    });
    setTraces(currentFrame.data);
    setLayout(currentFrame.layout);
    setRevision((r) => r + 1);
  }, [currentDay, pageReady, frames, regions, selectedRegions]);

  const handleHover = (e) => {
    const regionsIdx = e.points.reduce(
      (r, p) => [...r, p.curveNumber % regions.length],
      []
    );
    setHoveredTraces((t) => new Set([...t, ...regionsIdx]));
  };

  const handleUnhover = (e) => {
    const regionsIdx = new Set(
      e.points.reduce((r, p) => [...r, p.curveNumber % regions.length], [])
    );
    setHoveredTraces((t) => new Set([...t].filter((i) => !regionsIdx.has(i))));
  };

  return (
    <div className="font-sans grid grid-cols-12 grid-rows-12 min-h-screen items-stretch justify-items-stretch">
      <header className="row-span-3 col-span-full">
        <div className="bg-red-600 shadow-sm py-1 sm:py-4">
          <p className="animate__animated animate__fadeInDown font-bold text-lg sm:text-3xl text-white text-center">
            <span class="inline-block">COVID-19 Growth</span>{" "}
            <span class="inline-block">in Italian Regions</span>
          </p>
        </div>
        <div className="flex items-center justify-center">
          <p className="max-w-2xl text-left mx-6 mt-2 sm:mt-5 text-sm">
            This interactive chart compares the number of total cases with the
            number of new cases in the previous week. It is plotted using a{" "}
            <a
              href="https://en.wikipedia.org/wiki/Logarithmic_scale"
              className="text-red-600 hover:underline"
            >
              logarithmic scale
            </a>{" "}
            so that{" "}
            <a
              href="https://en.wikipedia.org/wiki/Exponential_growth"
              className="text-red-600 hover:underline"
            >
              exponential growth
            </a>{" "}
            is represented by a straight line along which cases double every
            week.
          </p>
        </div>
      </header>
      <main className="row-start-4 row-span-8 col-span-full -mt-20">
        <OverlaySpinner
          loading={!chartReady}
          duration={1000}
          onAnimationEnd={useCallback(() => setPageReady(true), [setPageReady])}
          containerClasses="flex justify-center items-start"
        >
          <Chart
            classes="w-full sm:w-5/6 h-full"
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
          <RegionsFilter
            classes="hidden lg:block lg:ml-4 sm:mt-20"
            regions={regions}
            selectedRegions={selectedRegions}
            onChange={setSelectedRegions}
          />
        </OverlaySpinner>
      </main>
      <Footer classes="row-start-12 col-span-full" />
    </div>
  );
};

export default App;
