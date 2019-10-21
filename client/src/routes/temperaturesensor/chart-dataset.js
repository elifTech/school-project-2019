import format from 'moment';

export default events => {
  const chartColor = '#5b92e5';
  return {
    datasets: [
      {
        backgroundColor: 'rgba(175,192,192,0.4)',
        borderCapStyle: 'butt',
        borderColor: chartColor,
        borderDash: [],
        borderDashOffset: 0,
        borderJoinStyle: 'miter',
        data: events.map(({ degree }) => degree),
        fill: false,
        label: 'Degree',
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
    labels: events.map(({ CreatedAt }) =>
      format(CreatedAt).format('DD-MM HH:mm:ss'),
    ),
  };
};
