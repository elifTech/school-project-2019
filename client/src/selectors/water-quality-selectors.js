import { createSelector } from 'reselect';
import moment from 'moment';

const qualityFixed = 2;

const getEvents = state =>
  state.waterQuality.events.map(({ period, quality }) => ({
    period,
    quality,
  }));

export const getFixedQuality = createSelector(
  [getEvents],
  events => events.map(event => event.quality.toFixed(qualityFixed)),
);
export const getEventsTime = createSelector(
  [getEvents],
  events => events.map(({ period }) => moment(period).format('MM.DD HH:mm')),
);
