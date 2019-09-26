import moment from 'moment';

export default events => {
  const chartColor = 'rgba(63, 73, 111, .6)';
  const backgroundFill = 'rgba(63, 73, 111, .1)';
  const pointColor = '#66729b';

  const dataPoints = events.map(({ power }) => power);
  const labels = events.map(({ CreatedAt }) =>
    moment(CreatedAt).format('HH:mm'),
  );

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
      labels,
    },
    options: { legend: { display: false } },
    type: 'line',
  };
};
