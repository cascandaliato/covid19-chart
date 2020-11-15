import flatMap from "lodash/fp/flatMap";
import flow from "lodash/fp/flow";
import get from "lodash/fp/get";
import map from "lodash/fp/map";
import max from "lodash/fp/max";
import values from "lodash/fp/values";
import styles from "./styles";

const maxCases = (byRegionAndDate, label) =>
  flow(values, flatMap(values), map(get(label)), max)(byRegionAndDate);

const getBaseLayout = (byRegionAndDate) => ({
  xaxis: {
    type: "log",
    title: "Total cases",
    range: [0, Math.log10(maxCases(byRegionAndDate, "totalCases") * 1.1)],
    fixedrange: true,
    showline: true,
    linecolor: styles.AXES_COLOR,
    titlefont: {
      size: styles.AXES_TITLE_SIZE,
      color: styles.AXES_TITLE_COLOR,
    },
    automargin: true,
  },
  yaxis: {
    type: "log",
    title: "New cases in the previous week",
    titlefont: {
      size: styles.AXES_TITLE_SIZE,
      color: styles.AXES_TITLE_COLOR,
    },
    range: [0, Math.log10(maxCases(byRegionAndDate, "totalCases") * 1.1)], // must match xaxis
    fixedrange: true,
    showline: true,
    linecolor: styles.AXES_COLOR,
    automargin: true,
  },
  responsive: true,
  autosize: true,
  showlegend: false,
  paper_bgcolor: styles.CHART_BACKGROUND,
  plot_bgcolor: styles.CHART_BACKGROUND,
  hovermode: "closest",
  hoverlabel: {
    bgcolor: styles.TOOLTIP_BACKGROUND,
    font: { size: styles.TOOLTIP_FONT_SIZE, color: styles.FONT_COLOR },
  },
  font: {
    color: styles.FONT_COLOR,
    family: styles.FONT_FAMILY,
  },
});

export default getBaseLayout;
