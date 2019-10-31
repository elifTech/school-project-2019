import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import Switch from 'react-switch';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { changeWaterConsumptionStatus } from '../../../actions/water-consumption';
import s from './WaterConsumptionWidget.css';

let waterConsumptionMetrics;
if (process.env.BROWSER) {
  // eslint-disable-next-line global-require
  const WaterConsumptionMetrics = require('../WaterConsumptionMetrics').default;
  waterConsumptionMetrics = <WaterConsumptionMetrics />;
}
class WaterConsumptionWidget extends React.Component {
  static propTypes = {
    error: PropTypes.string.isRequired,
    handleWaterConsumptionStatus: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.number.isRequired,
  };

  render() {
    const { name, status, handleWaterConsumptionStatus } = this.props;
    return (
      <div className={s.container}>
        <div style={this.getError()} className={s.serverError}>
          Server unavailable
        </div>

        <div className={s.header}>
          <h1>{name}</h1>
          <Switch
            checked={status === 1}
            onChange={handleWaterConsumptionStatus}
            onColor="#BCC4D7"
            onHandleColor="#3c9ecf"
            handleDiameter={21}
            uncheckedIcon={false}
            checkedIcon={false}
            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            activeBoxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
            height={14}
            width={34}
          />
        </div>

        <div className={s.metricsWraper}>
          <h3>Total water meter metrics</h3>
          {waterConsumptionMetrics} <h2>liters</h2>
        </div>
        <div
          className={classNames(s.indicator, {
            [s.indicatorOff]: status === 0,
            [s.indicatorOK]: status === 1,
            [s.indicatorAlert]: status === 2,
          })}
        />
        <h3>
          Flood sensor:{' '}
          <span
            className={classNames({
              [s.statusColorOk]: status === 1,
              [s.statusColorAlert]: status === 2,
            })}
          >
            {this.getStatus()}
          </span>
        </h3>
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

  getError() {
    let getDisplay = { display: 'none' };
    const { error } = this.props;
    if (error) {
      getDisplay = { display: 'flex' };
    }
    return getDisplay;
  }
}

export default withStyles(s)(
  connect(
    ({
      waterConsumption: {
        info: { Status, Name },
        error,
      },
    }) => ({
      error,
      name: Name,
      status: Status,
    }),
    { handleWaterConsumptionStatus: changeWaterConsumptionStatus },
  )(WaterConsumptionWidget),
);
