import times from 'lodash/times';
// import Plotly from 'plotly.js';
import Plotly from 'plotly.js-basic-dist';
import React, { useEffect, useRef, useState } from 'react';
import Slider from './components/Slider';

export default () => {
  const [day, setDay] = useState(1);
  const graphDiv = useRef(null);

  useEffect(() => {
    if (!graphDiv.current) return;
    (async () => {
      const data = await (
        await fetch(
          'https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json',
        )
      ).json();
      console.log(data);
      // from array to object
      const byRegion = data.reduce((byRegion, datum) => {
        const region = datum.denominazione_regione;
        const regionData = byRegion[region] || [];
        regionData.push({
          date: Date.parse(datum.data),
          totalCases: datum.totale_casi,
        });
        byRegion[region] = regionData;
        return byRegion;
      }, {});
      // const byRegionDate = data.reduce(
      //   (m, { denominazione_regione: r, data: d, totale_casi: totalCases }) => ({
      //     ...m,
      //     [r]: { ...m[r], [Date.parse(d)]: { totalCases } },
      //   }),
      //   {},
      // );

      // const regions = Object.keys(byRegionDate);
      // const dates = Array.from(
      //   new Set(Object.keys(byRegionDate).flatMap((r) => Object.keys(byRegionDate[r]))),
      // ).sort((a, b) => a - b);

      const traces = [];
      for (const [region, data] of Object.entries(byRegion)) {
        // sort
        data.sort(({ dateA }, { dateB }) => dateA >= dateB);
        // calculate new weekly cases
        data.forEach((datum, idx) => {
          if (idx >= 7) {
            datum.newCases = datum.totalCases - data[idx - 7].totalCases;
          }
        });
        // discard results from 1st week
        times(7, () => data.shift());
        // generate plotly trace
        traces.push(
          data.reduce(
            (trace, datum) => {
              trace.x.push(datum.totalCases);
              trace.y.push(datum.newCases);
              return trace;
            },
            {
              x: [],
              y: [],
              name: region,
              line: {
                color: 'gray',
                width: 0.5,
                shape: 'spline',
              },
              mode: 'lines',
              type: 'scatter',
            },
          ),
        );
      }
      const layout = {
        title: {
          text: '<b>Nuovi casi vs Totale casi (scala logaritmica)</b>',
        },
        xaxis: {
          type: 'log',
          // autorange: true,
          title: 'Totale casi',
          range: [0, Math.log10(100000)],
          showline: true,
        },
        yaxis: {
          type: 'log',
          // autorange: true,
          title: 'Nuovi casi nella settimana precedente',
          range: [0, Math.log10(100000)],
          showline: true,
          linecolor: 'rgb(224,224,224)',
        },
        responsive: true,
        autosize: true,
        showlegend: false,
      };
      const frames = [];
      const numFrames = traces[0].x.length;
      for (let i = 1; i <= numFrames; i++) {
        const frameLayout = { annotations: [] };
        traces.forEach((t, idx) => {
          frameLayout.annotations.push({
            x: Math.log10(t.x[i - 1]),
            y: Math.log10(t.y[i - 1]),
            xanchor: 'left',
            yanchor: 'middle',
            text: Object.keys(byRegion)[idx],
            font: {
              size: 8,
            },
            showarrow: false,
          });
        });
        const lines = traces.map((t) => ({
          ...t,
          x: t.x.slice(0, i),
          y: t.y.slice(0, i),
        }));
        const dots = traces.map((t) => ({
          ...t,
          x: [t.x[i - 1]],
          y: [t.y[i - 1]],
          mode: 'markers',
          marker: {
            color: 'fuchsia',
            size: 3,
          },
        }));
        frames.push({
          data: [...lines, ...dots],
          name: `frame${i}`,
          layout: frameLayout,
        });
      }
      await Plotly.newPlot(graphDiv.current, {
        data: frames[0].data,
        layout,
      });
      Plotly.addFrames(graphDiv.current, frames);
      Plotly.animate(graphDiv.current, null, {
        transition: {
          duration: 100,
          easing: 'linear',
        },
        frame: {
          duration: 100,
          redraw: false,
        },
      });
      setTimeout(() => {
        console.log('stop');
        Plotly.animate(graphDiv.current, [], { mode: 'next' });
      }, 2000);
    })();
  }, []);

  // useEffect(() => {
  //   if (!graphDiv.current) return;
  //   var data = [
  //     {
  //       x: [1999, 2000, 2001, 2002],
  //       y: [10, 15, 13, 17],
  //       type: 'scatter',
  //     },
  //   ];
  //   var layout = {
  //     title: 'Sales Growth',
  //     xaxis: {
  //       title: 'Year',
  //       showgrid: false,
  //       zeroline: false,
  //     },
  //     yaxis: {
  //       title: 'Percent',
  //       showline: false,
  //     },
  //   };
  //   Plotly.newPlot(graphDiv.current, data, layout);
  // }, [graphDiv]);
  return (
    <>
      <header>
        <h1>COVID-19 Growth in Italian Regions</h1>
        <h6>Simulation: day {day}</h6>
        {/* <Chart data={data} layout={layout} revision={revision} frames={frames} /> */}
        <div ref={graphDiv} />
        <Slider step={1} min={1} max={10} value={day} onChange={setDay} />
      </header>
    </>
  );
};
