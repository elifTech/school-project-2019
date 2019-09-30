import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import withStyles from 'isomorphic-style-loader/withStyles';
import { HorizontalBar, defaults } from 'react-chartjs-2';
import s from './WaterMeter.css';
import WaterMeterDataSet from './WaterMeterDataSet';

defaults.global.defaultFontFamily = 'Montserrat';

const options = {
  legend: {
    display: true,
    position: 'bottom',
  },
  title: {
    display: true,
    fontSize: 25,
    text: `Water consumption per September`,
  },
};

const WaterMeterChart = ({ waterMeterEvents }) => {
  return (
    <div className={s.chart}>
      <HorizontalBar
        data={WaterMeterDataSet(waterMeterEvents, 'Water Consumtion')}
        options={options}
      />
    </div>
  );
};

WaterMeterChart.propTypes = {
  waterMeterEvents: PropTypes.arrayOf(
    PropTypes.shape({
      Consumption: PropTypes.number.isRequired,
      CreatedAt: PropTypes.string.isRequired,
      ID: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
};

export default connect(({ waterMeter: { waterMeterEvents, error } }) => ({
  error,
  waterMeterEvents,
}))(withStyles(s)(React.memo(WaterMeterChart)));
