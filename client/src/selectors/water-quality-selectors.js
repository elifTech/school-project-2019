import { createSelector } from 'reselect';
import moment from 'moment';

export const FIXED = 2;

const getFormatDate = filter => {
  switch (filter) {
    case 'second':
      return 'H:m:ss';
    case 'hour':
      return 'M.DD HH';
    case 'day':
      return 'M.DD';
    case 'week':
      return 'M.DD';
    case 'month':
      return 'YYYY MM';
    default:
      return 'YYYY M.DD';
  }
};

const getEvents = state => {
  const { filter } = state.waterQuality;
  return state.waterQuality.events.map(({ period, quality }) => ({
    filter,
    period,
    quality,
  }));
};

export const getFixedQuality = createSelector(
  [getEvents],
  events => events.reverse().map(({ quality }) => quality.toFixed(FIXED)),
);

export const getMax = createSelector(
  [getEvents],
  events => Math.max(...events.map(({ quality }) => quality.toFixed(FIXED))),
);

export const getMin = createSelector(
  [getEvents],
  events => Math.min(...events.map(({ quality }) => quality.toFixed(FIXED))),
);
export const getEventsTime = createSelector(
  [getEvents],
  events => {
    const selectedFilter = events.map(({ filter }) => filter)[0];
    return events
      .reverse()
      .map(({ period }) =>
        moment(period).format(getFormatDate(selectedFilter)),
      );
  },
);

const getWaterStructure = state =>
  Object.entries(state.waterQuality.waterStructure);

export const getFixedStructure = createSelector(
  [getWaterStructure],
  elements => elements.map(element => element[1].toFixed(FIXED)),
);

export const getStructureLabels = createSelector(
  [getWaterStructure],
  elements => elements.map(element => element[0]),
);
