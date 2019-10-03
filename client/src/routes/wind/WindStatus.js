import React from 'react';
import Switch from 'react-switch';
import withStyles from 'isomorphic-style-loader/withStyles';

import { connect } from 'react-redux';
import { changeWindStatus } from '../../actions/wind-sensor';
import s from './css/WindStatus.css';

const parseStatus = status => {
  switch (status) {
    case 1:
      return true;
    default:
      return false;
  }
};

const WindStatus = ({ name, status, changeWindStatus }) => (
  <div className={s.container}>
    <h1 className={s.header}>{name}</h1>
    <Switch
      checked={parseStatus(status)}
      onChange={changeWindStatus}
      onColor="#BCC4D7"
      onHandleColor="#909cbc"
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

export default withStyles(s)(
  connect(
    ({
      windSensor: {
        info: { Status },
      },
    }) => ({
      status: Status,
    }),
    { changeWindStatus },
  )(WindStatus),
);
