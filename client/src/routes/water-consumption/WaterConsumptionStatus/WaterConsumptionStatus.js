import React from 'react';
import Switch from 'react-switch';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';

import { connect } from 'react-redux';
import { changeWaterConsumptionStatus } from '../../../actions/water-consumption';
import s from './WaterConsumptionStatus.css';

const parseStatus = status => {
  switch (status) {
    case 1:
      return true;
    default:
      return false;
  }
};

const WaterConsumptionStatus = ({
  name,
  status,
  dispatchChangeWaterConsumptionStatus,
}) => (
  <div className={s.container}>
    <h1 className={s.header}>{name}</h1>
    <Switch
      checked={parseStatus(status)}
      onChange={dispatchChangeWaterConsumptionStatus}
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

WaterConsumptionStatus.propTypes = {
  dispatchChangeWaterConsumptionStatus: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
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
    { dispatchChangeWaterConsumptionStatus: changeWaterConsumptionStatus },
  )(WaterConsumptionStatus),
);
