import flow from 'lodash/fp/flow';
import identity from 'lodash/fp/identity';
import keys from 'lodash/fp/keys';
import map from 'lodash/fp/map';
import propertyOf from 'lodash/fp/propertyOf';
import reduce from 'lodash/fp/reduce';
import sortBy from 'lodash/fp/sortBy';
import values from 'lodash/fp/values';

const reduceWithIdx = reduce.convert({ cap: false });

const traceTemplate = () => ({
  x: [],
  y: [],
  line: {
    color: 'gray',
    width: 0.5,
    shape: 'spline',
  },
  mode: 'lines',
  type: 'scatter',
  text: [],
});

const getTraces = (byRegionAndDate, dates) =>
  flow(
    keys,
    sortBy(identity),
    map(
      flow(propertyOf(byRegionAndDate), values, sortBy('date'), (regionData) =>
        reduceWithIdx(
          (trace, { region, newCases, totalCases }, idx) => ({
            ...trace,
            region,
            x: [...trace.x, totalCases],
            y: [...trace.y, newCases],
            text: [...trace.text, dates[idx]],
            hovertemplate: `<b>${region}</b><br><i>%{text}</i><br>Total cases: %{x}<br>New cases: %{y}<extra></extra>`,
          }),
          traceTemplate(),
        )(regionData),
      ),
    ),
  )(byRegionAndDate);

export default getTraces;
