import moment from 'moment';

const processEventGroups = groups =>
  groups.map(group =>
    (
      group.reduce((a, { Consumption }) => a + Consumption, 0) / group.length
    ).toFixed(1),
  );

const processTimeGroups = groups =>
  groups
    .map(group =>
      group.length === 1
        ? group[0].Created
        : new Date(
            new Date(group[0].Created).getTime() +
              (new Date(group[group.length - 1].Created) -
                new Date(group[0].Created)) /
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
  const maxEventsPerMinute = 60;
  if (period === 'hour') {
    filteredEvents = filteredEvents
      .slice(-maxEventsPerMinute)
      .filter(
        ({ Created }) =>
          moment(Created).isAfter(moment().startOf('hour')) &&
          moment(Created).isBefore(moment().endOf('hour')),
      );
  }

  if (filteredEvents.length === 0) return [];

  const interval = getInterval(
    new Date(filteredEvents[0].Created),
    new Date(filteredEvents[filteredEvents.length - 1].Created),
  );

  const groups = [];
  let timespanGroup = [];
  filteredEvents.forEach(event => {
    if (timespanGroup.length === 0) {
      // initialize first event in 30-minutes group
      timespanGroup[0] = event;
    }
    if (
      new Date(timespanGroup[0].Created).getTime() + interval >=
      new Date(event.Created).getTime()
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

export default function getWaterMeterDataSet(events, period) {
  const groups = breakIntoGroups(events, period);
  const dataValue = processEventGroups(groups);
  const timeLabels = processTimeGroups(groups);

  return {
    data: {
      datasets: [
        {
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          data: dataValue,
        },
      ],
      labels: timeLabels,
    },
    options: {
      legend: { display: false },
      maintainAspectRatio: false,
      responsive: true,
      scales: {
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
        yAxes: [
          {
            barPercentage: 0.8,
            barThickness: 25,
            maxBarThickness: 30,
            ticks: {
              callback(value) {
                return moment(value).format('HH:mm');
              },
            },
          },
        ],
      },
      tooltips: {
        callbacks: {
          label({ value }) {
            return `${value} liters`;
          },
          title(info, { labels }) {
            return moment(labels[info[0].index]).format('HH:mm, MMM D');
          },
        },
      },
    },
  };
}
