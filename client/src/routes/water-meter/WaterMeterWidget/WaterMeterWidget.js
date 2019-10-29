import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import Switch from 'react-switch';
import { connect } from 'react-redux';
import classNames from 'classnames';
import { changeWaterMeterStatus } from '../../../actions/water-meter';
import s from './WaterMeterWidget.css';

const parseStatus = status => {
  switch (status) {
    case 1:
      return true;
    default:
      return false;
  }
};

const statusAlert = status => {
  switch (status) {
    case 2:
      return true;
    default:
      return false;
  }
};

let waterMeterMetrics;
if (process.env.BROWSER) {
  // eslint-disable-next-line global-require
  const WaterMeterMetrics = require('../WaterMeterMetrics').default;
  waterMeterMetrics = <WaterMeterMetrics />;
}
function WaterMeterWidget({ name, status, dispatchChangeWaterMeterStatus }) {
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
      <div>
        <h1 className={s.header}>{name}</h1>
        <Switch
          checked={parseStatus(status)}
          onChange={dispatchChangeWaterMeterStatus}
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
        {waterMeterMetrics} <h2>liters</h2>
      </div>
      <div
        className={classNames(s.indicator, {
          [s.indicatorOff]: status === 0,
          [s.indicatorOK]: status === 1,
          [s.indicatorAlert]: statusAlert(status),
        })}
      />
      <h3>
        Flood sensor:{' '}
        <span
          className={classNames({
            [s.statusColorOk]: status === 1,
            [s.statusColorAlert]: statusAlert(status),
          })}
        >
          {floodStatus}
        </span>
      </h3>
    </div>
  );
}

WaterMeterWidget.propTypes = {
  dispatchChangeWaterMeterStatus: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  status: PropTypes.number.isRequired,
};

export default withStyles(s)(
  connect(
    ({
      waterMeter: {
        info: { Status, Name },
      },
    }) => ({
      name: Name,
      status: Status,
    }),
    { dispatchChangeWaterMeterStatus: changeWaterMeterStatus },
  )(WaterMeterWidget),
);
