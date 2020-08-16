import flow from 'lodash/fp/flow';
import identity from 'lodash/fp/identity';
import keys from 'lodash/fp/keys';
import map from 'lodash/fp/map';
import propertyOf from 'lodash/fp/propertyOf';
import reduce from 'lodash/fp/reduce';
import sortBy from 'lodash/fp/sortBy';
import values from 'lodash/fp/values';

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
});

export default (byRegionAndDate) =>
  flow(
    keys,
    sortBy(identity),
    map(
      flow(propertyOf(byRegionAndDate), values, sortBy('date'), (regionData) =>
        reduce(
          (trace, { region, newCases, totalCases }) => ({
            ...trace,
            region,
            x: [...trace.x, totalCases],
            y: [...trace.y, newCases],
          }),
          traceTemplate(),
        )(regionData),
      ),
    ),
  )(byRegionAndDate);
