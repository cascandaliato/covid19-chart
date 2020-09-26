const getFrames = (traces, regions) => {
  const frames = [];
  const numFrames = traces[0].x.length;
  for (let i = 1; i <= numFrames; i++) {
    const frameLayout = {
      annotations: [
        {
          x: Math.log10(500),
          y: Math.log10(500),
          xref: 'x',
          yref: 'y',
          yshift: 12,
          text: 'Cases double every week on this line',
          showarrow: false,
          font: { size: 14, color: 'gray' },
          visible: false,
          textangle: 0,
        },
      ],
    };
    traces.forEach((t, idx) => {
      frameLayout.annotations.push({
        x: Math.log10(t.x[i - 1]),
        y: Math.log10(t.y[i - 1]),
        xanchor: 'left',
        yanchor: 'middle',
        text: regions[idx],
        font: {
          size: 16,
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
        size: 4,
      },
    }));
    const expontialGrowth = {
      x: [1, 1000000],
      y: [1, 1000000],
      line: {
        color: 'fuchsia',
        width: 2,
        shape: 'spline',
        dash: 'dot',
      },
      mode: 'lines',
      type: 'scatter',
    };
    frames.push({
      data: [...lines, ...dots, expontialGrowth],
      name: `frame${i}`,
      layout: frameLayout,
    });
  }
  return frames;
};

export default getFrames;
