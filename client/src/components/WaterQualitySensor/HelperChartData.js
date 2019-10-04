export default function setData(quality, time) {
  const chartColor = 'rgba(63, 73, 111, .6)';
  return {
    datasets: [
      {
        backgroundColor: 'none',
        borderColor: chartColor,
        borderWidth: 2,
        data: quality,
        fill: 'none',
        label: 'Water quality',
        lineTension: 0.2,
        pointHoverRadius: 3,
        pointRadius: 2,
      },
    ],
    labels: time,
  };
}
