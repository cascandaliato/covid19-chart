import bind from 'lodash/bind';
import drop from 'lodash/fp/drop';
import flow from 'lodash/fp/flow';
import groupBy from 'lodash/fp/groupBy';
import identity from 'lodash/fp/identity';
import keyBy from 'lodash/fp/keyBy';
import keys from 'lodash/fp/keys';
import map from 'lodash/fp/map';
import mapKeys from 'lodash/fp/mapKeys';
import mapValues from 'lodash/fp/mapValues';
import pick from 'lodash/fp/pick';
import pickBy from 'lodash/fp/pickBy';
import propertyOf from 'lodash/fp/propertyOf';
import sortBy from 'lodash/fp/sortBy';
import sortedUniq from 'lodash/fp/sortedUniq';
import uniq from 'lodash/fp/uniq';
import indexOf from 'lodash/indexOf';
import set from 'lodash/set';
import { useEffect, useState } from 'react';

const itToEn = {
  data: 'date',
  denominazione_regione: 'region',
  totale_casi: 'totalCases',
};

const pickByKey = (predicate) => pickBy((_, key) => predicate(key));

const mapPropValue = (propName, mapFn) => (obj) => ({
  ...obj,
  [propName]: mapFn(obj[propName]),
});

const withMinimum = (minimum) => (val) => Math.max(minimum, val);

// const customGroupBy = (key) => flow(groupBy(key), mapValues(map(pickByKey(negate(eq(key))))));
// const customKeyBy = (key) => flow(keyBy(key), mapValues(pickByKey(negate(eq(key)))));

export default (daysDelay = 1) => {
  const [covidData, setCovidData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const rawData = await (
        await fetch(
          'https://raw.githubusercontent.com/pcm-dpc/COVID-19/master/dati-json/dpc-covid19-ita-regioni.json',
        )
      ).json();

      const data = map(
        flow(
          pick(keys(itToEn)),
          mapKeys(propertyOf(itToEn)),
          mapPropValue('totalCases', withMinimum(1)),
        ),
      )(rawData);

      const origDates = flow(map('date'), uniq, sortBy(identity))(data);
      const dates = drop(daysDelay)(origDates);
      const regions = flow(map('region'), sortBy(identity), sortedUniq)(data);

      // const filteredData = filter(({ date }) => dates.includes(date))(rawDataEn);

      let byRegionAndDate = flow(groupBy('region'), mapValues(keyBy('date')))(data);

      const calcNewCases = ({ region, date, totalCases }) =>
        totalCases - byRegionAndDate[region][origDates[indexOf(origDates, date) - 7]].totalCases;

      byRegionAndDate = mapValues(
        flow(
          pickByKey(bind(dates.includes, dates)),
          mapValues(
            flow(
              (val) => set(val, 'newCases', calcNewCases(val)),
              mapPropValue('newCases', withMinimum(1)),
            ),
          ),
        ),
      )(byRegionAndDate);

      // const byRegion = groupBy('region')(filteredData);
      // const byRegionAndDate = mapValues(keyBy('date'))(byRegion);

      // const byDate = groupBy('date')(filteredData);
      // const byDateAndRegion = mapValues(keyBy('region'))(byDate);

      // console.log({
      //   regionsListIsStable: regionsListIsStable(regions)(byDateAndRegion),
      //   datesListIsStable: datesListIsStable(dates)(byRegionAndDate),
      //   totalCasesIsAlwaysPositive: quantityIsAlwaysPositive('totalCases')(byRegionAndDate),
      //   newCasesIsAlwaysPositive: quantityIsAlwaysPositive('newCases')(byRegionAndDate),
      // });
      // console.log({ byDate, byDateAndRegion, byRegion, byRegionAndDate, regions, dates });

      setCovidData({ byRegionAndDate, regions, dates });
      setLoading(false);
    })();
  }, [daysDelay]);

  return { ...covidData, loading };
};
