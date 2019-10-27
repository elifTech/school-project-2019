export function setData(data, labels, colors = '#82b6f69c') {
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
export const segmentColors = [
  'rgba(191,2,8,0.76)',
  'rgba(247,178,0,0.88)',
  'rgba(39,176,71,0.8)',
  'rgba(247,178,0,0.88)',
  'rgba(191,2,8,0.76)',
];
