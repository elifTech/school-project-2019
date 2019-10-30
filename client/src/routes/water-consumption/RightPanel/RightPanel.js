import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/withStyles';
import WaterConsumptionStatus from '../WaterConsumptionStatus';
import WaterConsumptionIndicator from '../WaterConsumptionIndicator';
import FloodSensor from '../FloodSensor';

import s from './RightPanel.css';

class RightPanel extends React.PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
  };

  render() {
    const { name } = this.props;
    return (
      <div className={s.container}>
        <WaterConsumptionStatus name={name} />
        <div>
          <WaterConsumptionIndicator />
        </div>
        <div>{<FloodSensor />}</div>
      </div>
    );
  }
}

export default connect(
  ({
    waterConsumption: {
      info: { Name },
    },
  }) => ({
    name: Name,
  }),
  null,
)(withStyles(s)(RightPanel));
