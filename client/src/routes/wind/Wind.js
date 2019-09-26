/* eslint-disable max-classes-per-file */
import React from 'react';
import withStyles from 'isomorphic-style-loader/withStyles';
import PropTypes from 'prop-types';
import Chart from 'chart.js';
import { connect } from 'react-redux';
import WindChart from './WindChart';
import s from './Wind.css';

Chart.defaults.global.defaultFontFamily = 'Montserrat';

class Wind extends React.Component {
  static propTypes = {
    events: PropTypes.arrayOf(
      PropTypes.shape({
        CreatedAt: PropTypes.string.isRequired,
        ID: PropTypes.number.isRequired,
        direction: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        power: PropTypes.number.isRequired,
      }),
    ).isRequired,
    handleUnmount: PropTypes.func.isRequired,
    info: PropTypes.shape({
      Name: PropTypes.string.isRequired,
      Status: PropTypes.number.isRequired,
      Type: PropTypes.string.isRequired,
    }).isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

  componentWillUnmount() {
    const { handleUnmount } = this.props;
    handleUnmount();
  }

  render() {
    const { info, isLoading, events } = this.props;

    if (isLoading) return <div>Loading...</div>;
    return (
      <div className={s.container}>
        <h1>{info.Name}</h1>
        <h4>{info.Type}</h4>
        <span>Status: {this.parseStatus()}</span>
        <hr />
        <WindChart events={events} />
      </div>
    );
  }

  parseStatus = () => {
    const { info } = this.props;
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
}

export default connect(
  ({ windSensor: { info, events, loading, error } }) => ({
    error,
    events,
    info,
    isLoading: loading,
  }),
  null,
)(withStyles(s)(React.memo(Wind)));
