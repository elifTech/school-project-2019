export default function setData(data, labels, colors = '#82b6f69c') {
  const chartColor = 'rgba(116,129,150,0.6)';
  return {
    datasets: [
      {
        backgroundColor: colors,
        borderColor: chartColor,
        borderWidth: 2,
        data,
        label: 'Water quality',
        lineTension: 0.4,
        pointHoverRadius: 3,
        pointRadius: 2,
      },
    ],
    labels,
  };
}
