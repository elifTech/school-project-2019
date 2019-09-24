import moment from 'moment';

export default (events, label) => {
  const chartColor = 'rgba(63, 73, 111, .6)';
  return {
    datasets: [
      {
        backgroundColor: 'none',
        borderCapStyle: 'butt',
        borderColor: chartColor,
        borderDash: [],
        borderDashOffset: 0,
        borderJoinStyle: 'miter',
        data: events.map(({ power }) => power),
        fill: false,
        label,
        lineTension: 0.3,
        pointBackgroundColor: '#fff',
        pointBorderWidth: 0,
        pointHitRadius: 10,
        pointHoverBackgroundColor: chartColor,
        pointHoverBorderWidth: 0,
        pointHoverRadius: 4,
        pointRadius: 1,
      },
    ],
    labels: events.map(({ CreatedAt }) => moment(CreatedAt).format('HH:mm')),
  };
};
