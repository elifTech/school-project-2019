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
  const barColors = ['#3c9ecf', '#3f496f'];
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
            barPercentage: 0.8,
            maxBarThickness: 50,
            ticks: {
              callback(value) {
                if (period === 'day') {
                  return moment(value).format('MMM D, HH:mm');
                }
                if (period === 'isoWeek' || period === 'month')
                  return moment(value).format('MMMM D');
                return moment(value).format('MMMM');
              },
              fontSize: 18,
            },
          },
        ],
        yAxes: [
          {
            position: 'top',
            ticks: {
              beginAtZero: true,
              fontSize: 18,
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
