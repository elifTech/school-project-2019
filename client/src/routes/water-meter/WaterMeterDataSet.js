import moment from 'moment';

export default function waterMeterDataSet(waterMeterEvents, label) {
  return {
    datasets: [
      {
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        data: waterMeterEvents.map(({ Consumption }) => Consumption),
        label,
      },
    ],
    labels: waterMeterEvents.map(({ CreatedAt }) =>
      moment(CreatedAt).format('Do, HH:mm'),
    ),
  };
}
