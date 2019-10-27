/* eslint-disable no-magic-numbers */
import moment from 'moment';

export default events => {
  const chartColor = '#96dbfa';
  let backColor = '#96dbfa';
  if (events.length !== 0) {
    const sign = events.slice(-1)[0].degree;

    if (sign > 150) {
      backColor = '#ffa123';
    }
    if (sign > 300) {
      backColor = '#ff0000';
    }
  }

  return {
    datasets: [
      {
        // backgroundColor: backColor,
        borderCapStyle: 'butt',
        borderColor: backColor,
        borderDash: [],
        borderDashOffset: 0,
        borderJoinStyle: 'miter',
        data: events.map(({ degree }) => degree),
        fill: false,
        label: 'Degree °C',
        lineTension: 0.25,
        maintainAspectRatio: true,
        pointBackgroundColor: chartColor,
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
      moment(CreatedAt).format('DD-MM HH:mm:ss'),
    ),
  };
};