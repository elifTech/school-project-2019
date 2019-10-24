import React from 'react';
import Switch from 'react-switch';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';

import { connect } from 'react-redux';
import { changeWaterMeterStatus } from '../../../actions/water-meter';
import s from './WaterMeterStatus.css';

const parseStatus = status => {
  switch (status) {
    case 1:
      return true;
    default:
      return false;
  }
};

const WaterMeterStatus = ({ name, status, dispatchChangeWaterMeterStatus }) => (
  <div className={s.container}>
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
);

WaterMeterStatus.propTypes = {
  dispatchChangeWaterMeterStatus: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  status: PropTypes.number.isRequired,
};

export default withStyles(s)(
  connect(
    ({
      waterMeter: {
        info: { Status },
      },
    }) => ({
      status: Status,
    }),
    { dispatchChangeWaterMeterStatus: changeWaterMeterStatus },
  )(WaterMeterStatus),
);
