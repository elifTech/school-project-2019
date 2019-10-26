import moment from 'moment';

const processPowerGroups = groups =>
  groups.map(group =>
    (group.reduce((a, { power }) => a + power, 0) / group.length).toFixed(1),
  );

const processTimeGroups = groups =>
  groups
    .map(group =>
      group.length === 1
        ? group[0].created
        : new Date(
            new Date(group[0].created).getTime() +
              (new Date(group[group.length - 1].created) -
                new Date(group[0].created)) /
                2,
          ),
    )
    .map(date => moment(date).toDate());

const getInterval = (begin, end, max) => {
  const interval = Math.round((end - begin) / max);
  const HOURS_IN_DAY = 24;
  const MINUTES_IN_HOUR = 60;
  const SECONDS_IN_MINUTE = 60;
  const MILLISECONDS = 1000;
  const day = HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTE * MILLISECONDS;
  return interval > day ? day : interval;
};

const breakIntoGroups = (events, period) => {
  let filteredEvents = events;
  const maxPossibleDots = 8;
  const maxEventsPerMinute = 60;
  if (period === 'hour') {
    // the minimum period of arriving data is a day,
    // in case of hour we need to slice data events.
    // maximum possible amout is 60 events
    filteredEvents = filteredEvents
      .slice(-maxEventsPerMinute)
      .filter(
        ({ created }) =>
          moment(created).isAfter(moment().startOf('hour')) &&
          moment(created).isBefore(moment().endOf('hour')),
      );
  }
  if (filteredEvents.length === 0) return [];
  // dont groupify events if the amount is less than acceptable
  if (filteredEvents.length <= maxPossibleDots)
    return filteredEvents.map(event => [event]);

  const interval = getInterval(
    new Date(filteredEvents[0].created),
    new Date(filteredEvents[filteredEvents.length - 1].created),
    maxPossibleDots,
  );

  const groups = [];
  let timespanGroup = [];
  filteredEvents.forEach(event => {
    if (timespanGroup.length === 0) {
      // initialize first event in 30-minutes group
      timespanGroup[0] = event;
    }
    if (
      new Date(timespanGroup[0].created).getTime() + interval >=
      new Date(event.created).getTime()
    ) {
      // event in interval boundary
      timespanGroup.push(event);
    } else {
      // event is out of interval boundary, so start new interval group
      groups.push(timespanGroup);
      timespanGroup = [event];
    }
  });
  groups.push(timespanGroup);

  return groups;
};

export default (events, period) => {
  const chartColor = 'rgba(63, 73, 111, .6)';
  const backgroundFill = 'rgba(63, 73, 111, .1)';
  const pointColor = '#66729b';

  const groups = breakIntoGroups(events, period);
  const dataPoints = processPowerGroups(groups);
  const timeLabels = processTimeGroups(groups);

  return {
    data: {
      datasets: [
        {
          backgroundColor: backgroundFill,
          borderColor: chartColor,
          borderWidth: 2,
          data: dataPoints,
          pointBackgroundColor: pointColor,
          pointBorderWidth: 0,
          pointHitRadius: 10,
          pointHoverRadius: 2.5,
          pointRadius: 2.5,
        },
      ],
      labels: timeLabels,
    },
    options: {
      legend: { display: false },
      scales: {
        xAxes: [
          {
            ticks: {
              callback(value) {
                return moment(value).format('HH:mm');
              },
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              maxTicksLimit: 8,
              min: 5,
              suggestedMax: 50,
            },
          },
        ],
      },
      tooltips: {
        backgroundColor: 'rgba(63, 73, 111, .8)',
        callbacks: {
          label({ value }) {
            return `${value} km/h`;
          },
          labelColor() {
            return {
              backgroundColor: '#ff5f56',
            };
          },
          title(info, { labels }) {
            return moment(labels[info[0].index]).format('HH:mm, MMM D');
          },
        },
      },
    },
  };
};
