import React from 'react';
import Chart from 'chart.js';
import withStyles from 'isomorphic-style-loader/withStyles';
import moment from 'moment';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import style from '../../routes/water-quality-sensor/WaterQualitySensor.css';

const LineChart = ({ events, isFetching }) => {
  console.info(11, events)
  const chartColor = 'rgba(63, 73, 111, .6)';
  const lineChart = new Chart(React.createRef().current, {
    data: {
      datasets: [
        {
          backgroundColor: 'none',
          borderColor: chartColor,
          borderWidth: 1,
          data: events.map(event => event.quality),
          fill: 'none',
          label: 'Label',
          lineTension: 0,
          pointRadius: 2,
        },
      ],
      labels: events.map(({ CreatedAt }) =>
        moment(CreatedAt).format('HH:mm:ss'),
      ),
    },
    type: 'line',
  });

  return isFetching ? (
    <div> Loading ... </div>
  ) : (
    <div>
      <canvas id="lineChart" />
    </div>
  );
};

LineChart.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      CreatedAt: PropTypes.string.isRequired,
      ID: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      quality: PropTypes.number.isRequired,
    }),
  ).isRequired,
  isFetching: PropTypes.bool.isRequired,
};

export default connect(
  ({ waterQuality: { events, isFetching, error } }) => ({
    error,
    events,
    isFetching,
  }),
  null,
)(withStyles(style)(React.memo(LineChart)));
