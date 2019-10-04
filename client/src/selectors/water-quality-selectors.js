import { createSelector } from 'reselect';
import moment from 'moment';

const qualityFixed = 2;

const getEvents = state =>
  state.waterQuality.events.map(({ quality, CreatedAt }) => ({
    CreatedAt,
    quality,
  }));

export const getFixedQuality = createSelector(
  [getEvents],
  events => events.map(event => event.quality.toFixed(qualityFixed)),
);
export const getEventsTime = createSelector(
  [getEvents],
  events => events.map(({ CreatedAt }) => moment(CreatedAt).format('HH:mm:ss')),
);
