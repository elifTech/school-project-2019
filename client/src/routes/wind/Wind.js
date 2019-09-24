import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Line, defaults } from 'react-chartjs-2';
import prepareDataset from '../../utils/prepare-dataset';
import s from './Wind.css';

defaults.global.defaultFontFamily = 'Montserrat';

const options = {
  legend: { display: false },
};

const Wind = ({ info, events, isLoading }) => {
  const parseStatus = () => {
    switch (info.Status) {
      case 0:
        return 'Offline';
      case 1:
        return 'Online';
      case 2:
        return 'Need repair';
      default:
        return 'Error';
    }
  };

  if (isLoading) return <div>Loading...</div>;
  return (
    <div>
      <h1>{info.Name}</h1>
      <h4>{info.Type}</h4>
      <span>Status: {parseStatus()}</span>
      <hr />
      <div className={s.chart}>
        <Line data={prepareDataset(events, 'Wind Power')} options={options} />
      </div>
    </div>
  );
};

Wind.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      CreatedAt: PropTypes.string.isRequired,
      ID: PropTypes.number.isRequired,
      direction: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      power: PropTypes.number.isRequired,
    }),
  ).isRequired,
  info: PropTypes.shape({
    Name: PropTypes.string.isRequired,
    Status: PropTypes.number.isRequired,
    Type: PropTypes.string.isRequired,
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
};

export default connect(
  ({ windSensor: { info, events, loading, error } }) => ({
    error,
    events,
    info,
    isLoading: loading,
  }),
  null,
)(withStyles(s)(React.memo(Wind)));
