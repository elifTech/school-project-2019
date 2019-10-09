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
  scales: {
    xAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
  title: {
    display: true,
    fontSize: 25,
    text: `Water consumption per month`,
  },
};

class WaterMeterChart extends React.Component {
  static propTypes = {
    handleUnmount: PropTypes.func.isRequired,
    waterMeterEvents: PropTypes.arrayOf(
      PropTypes.shape({
        Consumption: PropTypes.number.isRequired,
        Created: PropTypes.string,
      }),
    ).isRequired,
  };

  componentWillUnmount() {
    const { handleUnmount } = this.props;
    handleUnmount();
  }

  render() {
    const { waterMeterEvents } = this.props;
    return (
      <div className={s.chart}>
        <HorizontalBar
          data={WaterMeterDataSet(waterMeterEvents, 'Water Consumtion')}
          options={options}
        />
      </div>
    );
  }
}

export default connect(({ waterMeter: { waterMeterEvents, error } }) => ({
  error,
  waterMeterEvents,
}))(withStyles(s)(React.memo(WaterMeterChart)));
