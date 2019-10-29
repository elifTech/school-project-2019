const MAXCA = 100;
const MAXK = 20;
const MAXMG = 80;
const MAXNA = 50;

export function setData(data, labels, isCompare = false, colors = '#82b6f69c') {
  const chartColor = 'rgba(116,129,150,0.6)';

  const defaultDataset = {
    backgroundColor: colors,
    borderColor: chartColor,
    borderWidth: 2,
    data,
    label: 'Current value',
    lineTension: 0.4,
    pointHoverRadius: 3,
    pointRadius: 2,
  };

  const compareBarDataset = {
    backgroundColor: '#a2d76e',
    borderColor: chartColor,
    borderWidth: 2,
    data: [MAXCA, MAXK, MAXMG, MAXNA],
    label: 'Maximum allowed value',
    lineTension: 0.4,
    pointHoverRadius: 3,
    pointRadius: 2,
  };
  const dataset = isCompare
    ? [compareBarDataset, defaultDataset]
    : [defaultDataset];

  return {
    datasets: dataset,
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
