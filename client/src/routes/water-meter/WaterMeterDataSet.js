import moment from 'moment';
import _ from 'lodash';

const breakIntoGroups = (events, period) => {
  let filteredEvents = events;
  let sortPeriod = 'month';
  filteredEvents = filteredEvents.filter(
    ({ Created }) =>
      moment(Created).isAfter(moment().startOf(period)) &&
      moment(Created).isBefore(moment().endOf(period)),
  );
  if (period === 'day') {
    sortPeriod = 'hour';
  } else if (period === 'isoWeek' || period === 'month') {
    sortPeriod = 'day';
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

export default function getWaterMeterDataSet(events, period) {
  const groups = breakIntoGroups(events, period);
  const dataValue = groups.map(({ Consumption }) => Consumption);
  const timeLabels = groups.map(({ Created }) => moment(Created));

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
            position: 'top',
            ticks: {
              beginAtZero: true,
            },
          },
        ],
        yAxes: [
          {
            barPercentage: 0.8,
            barThickness: 35,
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
