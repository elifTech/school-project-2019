import moment from 'moment';

export default (events, label) => {
  const chartColor = 'rgba(75,192,192,1)';
  return {
    datasets: [
      {
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderCapStyle: 'butt',
        borderColor: chartColor,
        borderDash: [],
        borderDashOffset: 0,
        borderJoinStyle: 'miter',
        data: events.map(({ signal }) => signal),
        fill: false,
        label,
        lineTension: 0.1,
        maintainAspectRatio: true,
        pointBackgroundColor: '#fff',
        pointBorderColor: chartColor,
        pointBorderWidth: 1,
        pointHitRadius: 10,
        pointHoverBackgroundColor: chartColor,
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointHoverRadius: 5,
        pointRadius: 1,
      },
    ],
    labels: events.map(({ Created }) => moment(Created).format('DD.MM HH:mm')),
  };
};
