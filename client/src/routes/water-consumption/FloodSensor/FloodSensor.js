import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { alertWaterConsumptionStatus } from '../../../actions/water-consumption';
import s from './FloodSensor.css';

class FloodSensor extends React.Component {
  static propTypes = {
    dispatchChangeWaterConsumptionStatus: PropTypes.func.isRequired,
    status: PropTypes.number.isRequired,
  };

  render() {
    const { status, dispatchChangeWaterConsumptionStatus } = this.props;
    return (
      <div className={s.container}>
        <h1 className={s.header}>Flood sensor</h1>
        <div
          className={classNames(s.indicator, {
            [s.indicatorOff]: status === 0,
            [s.indicatorOK]: status === 1,
            [s.indicatorAlert]: status === 2,
          })}
        />
        <h3>
          Status:{' '}
          <span
            className={classNames({
              [s.statusColorOk]: status === 1,
              [s.statusColorAlert]: status === 2,
            })}
          >
            {this.getStatus()}
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
  }

  getStatus() {
    let floodStatus;
    const { status } = this.props;
    switch (status) {
      case 1:
        floodStatus = 'Ok';
        break;
      case 2:
        floodStatus = 'Alert';
        break;

      default:
        floodStatus = 'Offline';
    }
    return floodStatus;
  }
}

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
