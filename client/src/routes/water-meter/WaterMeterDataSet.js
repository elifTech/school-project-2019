import moment from 'moment';
import _ from 'lodash';

const breakIntoGroups = (events, period) => {
  let filteredEvents = events;
  let sortPeriod = '';
  filteredEvents = filteredEvents.filter(
    ({ Created }) =>
      moment(Created).isAfter(moment().startOf(period)) &&
      moment(Created).isBefore(moment().endOf(period)),
  );
  if (period === 'day') {
    sortPeriod = 'hour';
  } else if (period === 'isoWeek' || period === 'month') {
    sortPeriod = 'day';
  } else if (period === 'year') {
    sortPeriod = 'month';
  }

  return _(filteredEvents)
    .map(item => {
      return {
        Consumption: parseInt(item.Consumption),
        Created: moment(item.Created)
          .startOf(sortPeriod)
          .toISOString(),
      };
    })
    .groupBy('Created')
    .map((item, date) => ({
      Consumption: _.sumBy(item, 'Consumption'),
      Created: date,
    }))
    .value();
};

const getBarColor = groups => {
  const barColors = ['#f7c19c', '#d17c54', '#84c8d1', '#f27979'];
  const j = barColors.length;
  if (groups.length > barColors.length) {
    for (let i = barColors.length; i < groups.length; i += 1) {
      barColors.push(barColors[i - j]);
    }
  }
  return barColors;
};

export default function getWaterMeterDataSet(events, period) {
  const groups = breakIntoGroups(events, period);
  const dataValue = groups.map(({ Consumption }) => Consumption);
  const timeLabels = groups.map(({ Created }) => moment(Created));

  return {
    data: {
      datasets: [
        {
          backgroundColor: getBarColor(groups),
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
            position: 'top',
            ticks: {
              beginAtZero: true,
            },
          },
        ],
        yAxes: [
          {
            barPercentage: 0.8,
            maxBarThickness: 55,
            ticks: {
              callback(value) {
                return moment(value).format('MMM D, HH:mm');
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
