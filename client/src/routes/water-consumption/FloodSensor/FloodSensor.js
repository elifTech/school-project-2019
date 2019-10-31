import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { alertWaterConsumptionStatus } from '../../../actions/water-consumption';
import s from './FloodSensor.css';

const statusAlert = status => {
  switch (status) {
    case 2:
      return true;
    default:
      return false;
  }
};

const FloodSensor = ({ status, dispatchChangeWaterConsumptionStatus }) => {
  let floodStatus;
  switch (status) {
    case 0:
      floodStatus = 'Offline';
      break;
    case 1:
      floodStatus = 'Ok';
      break;
    case 2:
      floodStatus = 'Alert!';
      break;
    default:
  }
  return (
    <div className={s.container}>
      <h1 className={s.header}>Flood sensor</h1>
      <div
        className={classNames(s.indicator, {
          [s.indicatorOff]: status === 0,
          [s.indicatorOK]: status === 1,
          [s.indicatorAlert]: statusAlert(status),
        })}
      />
      <h3>
        Status:{' '}
        <span
          className={classNames({
            [s.statusColorOk]: status === 1,
            [s.statusColorAlert]: statusAlert(status),
          })}
        >
          {floodStatus}
        </span>
      </h3>
      <button
        type="button"
        name="provoke flood"
        className={s.floodButton}
        onClick={dispatchChangeWaterConsumptionStatus}
      >
        Provoke flood
      </button>
    </div>
  );
};

FloodSensor.propTypes = {
  dispatchChangeWaterConsumptionStatus: PropTypes.func.isRequired,
  status: PropTypes.number.isRequired,
};

export default withStyles(s)(
  connect(
    ({
      waterConsumption: {
        info: { Status },
      },
    }) => ({
      status: Status,
    }),
    { dispatchChangeWaterConsumptionStatus: alertWaterConsumptionStatus },
  )(FloodSensor),
);
