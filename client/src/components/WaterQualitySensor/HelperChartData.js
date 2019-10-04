export default function setData(quality, time) {
  const chartColor = 'rgba(63, 73, 111, .6)';
  const backgroundColor = '#82b6f69c';
  return {
    datasets: [
      {
        backgroundColor,
        borderColor: chartColor,
        borderWidth: 2,
        data: quality,
        label: 'Water quality',
        lineTension: 0.2,
        pointHoverRadius: 3,
        pointRadius: 2,
      },
    ],
    labels: time,
  };
}
