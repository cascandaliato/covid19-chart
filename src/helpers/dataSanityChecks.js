import every from 'lodash/fp/every';
import flatMap from 'lodash/fp/flatMap';
import flow from 'lodash/fp/flow';
import identity from 'lodash/fp/identity';
import isEqual from 'lodash/fp/isEqual';
import keys from 'lodash/fp/keys';
import map from 'lodash/fp/map';
import sortBy from 'lodash/fp/sortBy';
import values from 'lodash/fp/values';

// wants byDateAndRegion
export const regionsListIsStable = (regions) =>
  flow(values, map(flow(keys, sortBy(identity))), every(isEqual(regions)));

// wants byRegionAndDate
export const datesListIsStable = (dates) =>
  flow(values, map(flow(keys, sortBy(identity))), every(isEqual(dates)));

// wants byRegionAndDate
export const quantityIsAlwaysPositive = (property) =>
  flow(
    values,
    flatMap(values),
    map(property),
    every((n) => n >= 0),
  );
