/* eslint-disable no-param-reassign */
import moment from 'moment';
import { parseBeaufortValue } from './wind-right-panel';

const findAverage = array => array.reduce((a, b) => a + b, 0) / array.length;

const findModeValue = strings => {
  const hashset = {};
  // generate hashset of { 'string': n },
  // where n is amount of times the string appears
  strings.forEach(string => {
    if (!hashset[string]) {
      hashset[string] = 1;
    } else {
      hashset[string] += hashset[string];
    }
  });
  // return the most common string
  return Object.keys(hashset).reduce((a, b) =>
    hashset[a] > hashset[b] ? a : b,
  );
};

const processEventGroup = group => {
  const averageSpeed = findAverage(group.map(({ power }) => power));
  const averageDescription = findModeValue(
    group.map(({ beaufort }) => parseBeaufortValue(beaufort)),
  );

  const day = moment(group[0].CreatedAt).format('MMMM D');
  const startHour = moment(group.slice(-1)[0].CreatedAt).format('HH:mm');
  const endHour = moment(group[0].CreatedAt).format('HH:mm');

  return {
    day,
    description: averageDescription,
    id: group[0].ID,
    speed: `${averageSpeed.toFixed(1)} km/h`,
    time: `${startHour} - ${endHour}`,
  };
};

export default events => {
  if (events.length === 0) return [];
  const group = [];
  const timespan = 30 * 60 * 1000; // 30 minutes in milliseconds

  const lastTimespanEvent = events.reduce((timespanGroup, event) => {
    if (timespanGroup.length === 0) timespanGroup[0] = event; // initialize first event in 30-minutes group
    if (
      new Date(timespanGroup[0].CreatedAt) - new Date(event.CreatedAt) <
      timespan
    ) {
      // event is in the 30-minutes boundary
      timespanGroup.push(event);
    } else {
      // event is out of 30-minutes boundary, so start new 30-minutes group
      group.push(processEventGroup(timespanGroup));
      timespanGroup = [];
    }
    return timespanGroup;
  }, []);
  // last formed event is presented as an accumulated value of reduce func
  group.push(processEventGroup(lastTimespanEvent));

  return group;
};

export const selectOnlyTodayEvents = events => {
  const today = moment()
    .clone()
    .startOf('day');
  return events.filter(({ CreatedAt }) => moment(CreatedAt).isSame(today, 'd'));
};
