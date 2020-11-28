import styles from "./styles";

const getFrames = (traces, regions) => {
  const frames = [];
  const numFrames = traces[0].x.length;
  for (let i = 1; i <= numFrames; i++) {
    // layout / annotations
    const frameLayout = {
      annotations: [],
    };
    traces.forEach((t, idx) => {
      frameLayout.annotations.push({
        x: Math.log10(t.x[i - 1]),
        y: Math.log10(t.y[i - 1]),
        xanchor: "left",
        yanchor: "middle",
        text: regions[idx],
        font: {
          size: styles.ANNOTATION_FONT_SIZE,
        },
        showarrow: false,
      });
    });
    frameLayout.annotations.push({
      x: Math.log10(500),
      y: Math.log10(500),
      xref: "x",
      yref: "y",
      yshift: 12,
      text: "Cases double every week on this line",
      showarrow: false,
      font: {
        size: styles.EXPONENTIAL_LINE_FONT_SIZE,
        color: styles.FONT_COLOR,
      },
      visible: false,
      textangle: 0,
    });

    // lines and markers
    const lines = traces.map((t) => ({
      ...t,
      x: t.x.slice(0, i),
      y: t.y.slice(0, i),
    }));
    const dots = traces.map((t) => ({
      ...t,
      text: [t.text[i - 1]],
      x: [t.x[i - 1]],
      y: [t.y[i - 1]],
      mode: "markers",
      marker: {
        color: styles.MAIN_COLOR,
        size: styles.MARKER_SIZE,
      },
    }));
    const expontialGrowth = {
      x: [1, 1000000],
      y: [1, 1000000],
      line: {
        color: styles.MAIN_COLOR,
        width: 2,
        shape: "spline",
        dash: "dot",
      },
      mode: "lines",
      type: "scatter",
      hoverinfo: "skip",
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
