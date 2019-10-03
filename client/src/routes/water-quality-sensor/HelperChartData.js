import moment from 'moment';

export default function setData(events) {
  const qualityFixed = 2;
  const chartColor = 'rgba(63, 73, 111, .6)';
  return {
    datasets: [
      {
        backgroundColor: 'none',
        borderColor: chartColor,
        borderWidth: 2,
        data: events.map(event => event.quality.toFixed(qualityFixed)),
        fill: 'none',
        label: 'Water quality',
        lineTension: 0.2,
        pointHoverRadius: 3,
        pointRadius: 2,
      },
    ],
    labels: events.map(({ CreatedAt }) => moment(CreatedAt).format('HH:mm:ss')),
  };
}
