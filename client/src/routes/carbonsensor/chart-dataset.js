/* eslint-disable no-magic-numbers */
import format from 'moment';

export default events => {
  let backColor = '#96dbfa';
  if (events.length !== 0) {
    const sign = events.slice(-1)[0].signal;

    if (sign > 50) {
      backColor = '#ffE000';
    }
    if (sign > 200) {
      backColor = '#ff0000';
    }
  }

  return {
    datasets: [
      {
        borderCapStyle: 'butt',
        borderColor: backColor,
        borderDash: [],
        borderDashOffset: 0,
        borderJoinStyle: 'miter',
        currency: 'ppm',
        data: events.map(({ signal }) => signal),
        fill: false,
        label: 'ppm',
        lineTension: 0.25,
        maintainAspectRatio: true,
        pointBackgroundColor: backColor,
        pointBorderColor: backColor,
        pointBorderWidth: 1,
        pointHitRadius: 10,
        pointHoverBackgroundColor: backColor,
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
