import flatMap from "lodash/fp/flatMap";
import flow from "lodash/fp/flow";
import get from "lodash/fp/get";
import map from "lodash/fp/map";
import max from "lodash/fp/max";
import values from "lodash/fp/values";

const maxCases = (byRegionAndDate, label) =>
  flow(values, flatMap(values), map(get(label)), max)(byRegionAndDate);

const getBaseLayout = (byRegionAndDate) => ({
  xaxis: {
    type: "log",
    title: "Total cases",
    range: [0, Math.log10(maxCases(byRegionAndDate, "totalCases") * 1.1)],
    fixedrange: true,
    showline: true,
    linecolor: "rgb(224,224,224)",
    titlefont: {
      size: 24,
      color: "#1a202c",
    },
    automargin: true,
  },
  yaxis: {
    type: "log",
    title: "New cases in the previous week",
    titlefont: {
      size: 24,
      color: "#1a202c",
    },
    range: [0, Math.log10(100000)],
    fixedrange: true,
    showline: true,
    linecolor: "rgb(224,224,224)",
    automargin: true,
  },
  responsive: true,
  autosize: true,
  showlegend: false,
  paper_bgcolor: "rgba(255,255,255,0)",
  plot_bgcolor: "rgba(255,255,255,0)",
  hovermode: "closest",
  hoverlabel: { bgcolor: "white", font: { size: 16, color: "#1a202c" } },
  font: {
    color: "#2d3748",
    family:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  },
});

export default getBaseLayout;
